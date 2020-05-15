// ==UserScript==
// @name         Kirito Tools
// @namespace    -
// @version      0.2.5
// @description  mykirito.com 的一些介面改善與小工具
// @author       LianSheng

// @include      https://mykirito.com/*

// @grant        GM_setValue
// @grant        GM_getValue

// @noframes

// @require      https://greasyfork.org/scripts/402133-toolbox/code/Toolbox.js

// @license      MIT
// ==/UserScript==

let expireMsg = {};
let abilityField = {
    hp: "HP",
    atk: "攻擊",
    def: "防禦",
    stm: "體力",
    agi: "敏捷",
    spd: "反應速度",
    tec: "技巧",
    int: "智力",
    lck: "幸運"
}
let action = {
    hunt: "狩獵兔肉",
    train: "自主訓練",
    eat: "外出野餐",
    girl: "汁妹",
    good: "做善事",
    sit: "坐下休息"
};

// 訊息框，
function message(msg, expire = 5000) {
    let randomID = Math.random().toString(36).substr(2, 6);

    let block = `
        <div id="us_messageBlock" data-id="${randomID}">
            <div style="position: fixed; top: 2rem; right: 2rem; background-color: #cdfaef; border-radius: 0.5rem; font-size: 1.2rem;">
                <span>${msg}</span>
            </div>
        </div>
    `;

    document.querySelector("div#us_customSpace").innerHTML += block;
    expireMsg[randomID] = Date.now() + expire;
}

function autoAction(actionCD) {
    if (GM_getValue("token") != undefined && GM_getValue("actionType") != undefined) {
        if (GM_getValue("nextAction") == undefined || Date.now() > GM_getValue("nextAction")) {
            let type = GM_getValue("actionType");
            fetch("https://mykirito.com/api/my-kirito/do", {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "token": GM_getValue("token")
                },
                "referrer": "https://mykirito.com/",
                "body": `{"action":"${type}"}`,
                "method": "POST"
            }).then(function (resp) {
                return resp.json();
            }).then(function (json) {
                try {
                    if (json.gained != undefined) {
                        if (json.gained.prevLV != json.gained.nextLV) {
                            let lastAction = parseInt(json.myKirito.lastAction);
                            let nextAction = lastAction + actionCD * 1000;
                            GM_setValue("nextAction", nextAction);
                            // 升級
                            let msg = `
                            <h5>角色已升至等級 ${json.gained.nextLV} (${json.myKirito.exp})，提升下列能力</h5>
                        `;

                            for (let [key, value] of Object.entries(json.gained)) {
                                if (abilityField[key] != undefined) {
                                    msg += `<div>${abilityField[key]} +${value}</div>`;
                                }
                            }

                            message(msg);
                        } else {
                            let lastAction = parseInt(json.myKirito.lastAction);
                            let nextAction = lastAction + actionCD * 1000;
                            GM_setValue("nextAction", nextAction);
                            let msg = `
                                <h5>行動已完成，獲得 ${json.gained.exp} 點經驗。</h5>
                            `;
                            message(msg);
                        }
                    } else {
                        let msg = `
                            <h5>${json.error}</h5>
                            <p>約 {} 秒後重試...</p>
                        `;
                        countDown(msg, 10, 1000);
                        let addTime = 10 * 1000 + Math.floor(Math.random() * 1000) + 1;
                        let errorNextAction = GM_getValue("nextAction") + addTime;
                        GM_setValue("nextAction", errorNextAction);
                    }
                } catch (e) {
                    return e;
                }
            }).catch(function (error) {
                console.log("[Kirito Tools] autoAction() Error: " + error);
                countDown("遇到意料外錯誤，約 {} 秒後重試。", 10, 1000);
                let addTime = 10 * 1000 + Math.floor(Math.random() * 1000) + 1;
                let errorNextAction = GM_getValue("nextAction") + addTime;
                GM_setValue("nextAction", errorNextAction);
            });
        }
    }
}

// format = "文字 {} 文字"
function countDown(format, times, period) {
    for (let i = times; i > 0; i--) {
        let msg = format.replace(/{}/g, times - i);
        message(msg, i * period);
    }
}



(async function () {
    'use strict';
    // 取得行動冷卻時間，若遭遇異常，以 87 秒爲預設
    let actionCD = 87;
    try {
        let frontend = await fetch("https://mykirito.com").then(r => r.text()).then(t => {
            return t.match(/frontend\.[0-9a-f]{8}.js/)[0];
        });
        actionCD = await fetch(`https://mykirito.com/${frontend}`).then(r => r.text()).then(t => {
            return t.match(/,([0-9]+)e3\),.+?=.+?\.disabled,.+?=.+?\.cooldown/)[1] - 0;
        });
    } catch (e) {}

    document.querySelector("div#root").insertAdjacentHTML("afterend", `<div id="us_customSpace"></div>`);

    let navbar = document.querySelector("div#root > nav");
    navbar.style.position = "fixed";
    navbar.style.top = "0";

    let navAction = navbar.firstElementChild.cloneNode(true);
    navAction.removeAttribute("href");
    navAction.removeAttribute("aria-current");
    navAction.classList.remove("active");
    navAction.style.userSelect = "none";
    navAction.style.cursor = "pointer";
    navAction.innerText = "行動設定";
    navAction.addEventListener("click", function () {
        location.href = "/actionSetting";
    });
    navbar.appendChild(navAction);

    let url = "";
    setInterval(function () {
        url = location.href;

        if (url.includes("user-list")) {
            // 在玩家列表頁
            if (document.querySelectorAll("div#root > div > div:nth-child(1) > table").length != 0) {
                // 尚未移動 list
                let listTable = document.querySelector("div#root > div > div:nth-child(1) > table");

                listTable.insertAdjacentHTML("beforebegin", `<div id="us_newButtonSpace"></div><div id="us_newListSpace"></div>`);

                let newListSpace = document.querySelector("div#us_newListSpace");

                newListSpace.appendChild(listTable);
                newListSpace.style.maxHeight = "80vh";
                newListSpace.style.overflowY = "scroll";
            }
        }

        if (url.includes("actionSetting")) {
            // 在自定義功能：行動設定
            if (document.querySelectorAll("div#us_actionSetting").length == 0) {
                let tableMore = "";
                if (GM_getValue("token") == undefined) {
                    tableMore = `
                        <tr>
                            <td colspan="2" style="background-color: #800; text-align: center; user-select: none;">
                                <span style="font-size: 1.5rem; color: white; font-weight: bold;">尚未輸入 Token!!</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <h3>Token 是什麼？</h3>
                                <p>Token 是可以操控你的帳號的關鍵，可以把它當作鑰匙。</p>
                                <p>爲了達到自動處理，你必須提供你的 token。</p>
                                <p style="color: red;">它非常重要，切記，絕對不要輕易把你的 token 告訴其他人！</p>
                                <p>這個腳本除了會暫存你的 token 外（它只存在你的電腦裡），不會發送任何資訊到其他地方。</p>

                                <h3>如何取得 token ？（常規操作僅限電腦）</h3>
                                <p>這裡以 Google Chrome 爲例：</p>

                                <h5>Step 1. 開啓開發者工具（F12） > 選到 Network > 篩選 XHR</h5>
                                <img src="https://i.imgur.com/FKm1sxs.png">
                                <h5>Step 2. 點擊上方任意頁面（這裡以戰報爲例） > 開發者工具清單多了一筆資訊，點擊名字</h5>
                                <img src="https://i.imgur.com/meP8T3b.png">
                                <h5>Step 3. 在 Request Headers 裡可以看到 token 的值，就是它了！</h5>
                                <img src="https://i.imgur.com/0aQUr5u.png">
                            </td>
                        </tr>
                    `;
                } else {
                    let actionType = "";
                    for (let [cmd, name] of Object.entries(action)) {
                        let checked = "";
                        if (GM_getValue("actionType") != undefined) {
                            if (GM_getValue("actionType") == cmd) {
                                checked = `checked="checked"`;
                            }
                        }
                        actionType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType" data-type="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
                    }

                    tableMore = `
                        <tr>
                            <td>行動類型</td>
                            <td>${actionType}</td>
                        </tr>
                    `;
                }

                let customRadio = `
                    /* The container */.container {  display: inline-block;  position: relative;  padding-left: 35px;  margin-bottom: 12px;  cursor: pointer;  font-size: 1rem;  -webkit-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none; width: 33%}/* Hide the browser's default radio button */.container input {  position: absolute;  opacity: 0;  cursor: pointer;}/* Create a custom radio button */.checkmark {  position: absolute;  top: 0;  left: 0;  height: 25px;  width: 25px;  background-color: #eee;  border-radius: 50%;}/* On mouse-over, add a grey background color */.container:hover input ~ .checkmark {  background-color: #ccc;}/* When the radio button is checked, add a blue background */.container input:checked ~ .checkmark {  background-color: #2196F3;}/* Create the indicator (the dot/circle - hidden when not checked) */.checkmark:after {  content: "";  position: absolute;  display: none;}/* Show the indicator (dot/circle) when checked */.container input:checked ~ .checkmark:after {  display: block;}/* Style the indicator (dot/circle) */.container .checkmark:after { 	top: 9px;	left: 9px;	width: 8px;	height: 8px;	border-radius: 50%;	background: white;}
                `;
                let setting = `
                    <div id="us_actionSetting" style="max-width: 760px; min-width: 400px; width: 92%; margin: 12px auto; padding-top: 3rem;">
                        <h3>行動設定</h3>
                        <p>行動設定是個可以讓你的角色自動行動的功能，讓你不再是每 ${actionCD} 秒就要點一次行動的 87。</p>
                        <hr>
                        <table style="width: 100%;">
                            <thead>
                                <th style="width: 40%;"></th>
                                <th style="width: 60%;"></th>
                            </thead>
                            <tbody>
                                ${tableMore}
                            </tbody>
                        </table>
                    </div>
                `;
                navbar.insertAdjacentHTML("afterend", setting);
                addStyle(customRadio, "div#us_actionSetting", "us_customRadio");

                let actionRadio = document.querySelectorAll(`input[name="us_asType"]`);
                actionRadio.forEach(function (each) {
                    each.addEventListener("click", function () {
                        let type = each.getAttribute("data-type");
                        GM_setValue("actionType", type);
                        message(`已將行動類型設定成【${action[each.getAttribute("data-type")]}】。`);
                    });
                });
            }
        } else {
            if (document.querySelectorAll("div#us_actionSetting").length != 0) {
                document.querySelector("div#us_actionSetting").remove();
            }
        }

        // 訊息框自動刪除（詳見 message()）
        for (let [key, value] of Object.entries(expireMsg)) {
            if (Date.now() > value) {
                document.querySelector(`div#us_messageBlock[data-id="${key}"]`).remove();
                delete expireMsg[key];
            }
        }
    }, 100);

    // 避免後續修改遇到錯誤時造成 dos
    setInterval(function () {
        autoAction(actionCD);

        // 自動取得 token，降低使用門檻
        if (GM_getValue("token") == undefined) {
            GM_setValue("token", localStorage.getItem("token"));
        }
    }, 1000);
})();