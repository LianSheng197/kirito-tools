// ==UserScript==
// @name         Kirito Tools
// @namespace    -
// @version      0.3.7
// @description  mykirito.com 的界面調整，不包含任何自動操作。
// @author       LianSheng
// @include      https://mykirito.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// ==/UserScript==

// （詳細資料）顯示其他玩家的轉生點加成
function addPointsToDetail(tableRows, playerData) {
    tableRows[4].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.hp > 0? "(+"+playerData.rattrs.hp*10+")" : ""}</span>`;
    tableRows[5].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.atk > 0? "(+"+playerData.rattrs.atk+")" : ""}</span>`;
    tableRows[6].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.def > 0? "(+"+playerData.rattrs.def+")" : ""}</span>`;
    tableRows[7].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.stm > 0? "(+"+playerData.rattrs.stm+")" : ""}</span>`;
    tableRows[8].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.agi > 0? "(+"+playerData.rattrs.agi+")" : ""}</span>`;
    tableRows[9].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.spd > 0? "(+"+playerData.rattrs.spd+")" : ""}</span>`;
    tableRows[10].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.tec > 0? "(+"+playerData.rattrs.tec+")" : ""}</span>`;
    tableRows[11].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.int > 0? "(+"+playerData.rattrs.int+")" : ""}</span>`;
    tableRows[12].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.lck > 0? "(+"+playerData.rattrs.lck+")" : ""}</span>`;
}

// （能力比對）顯示其他玩家的轉生點加成
function addPointsToCompare(tableRows, playerData) {
    tableRows[6].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.hp > 0? "(+"+playerData.rattrs.hp*10+")" : ""}</span>`;
    tableRows[7].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.atk > 0? "(+"+playerData.rattrs.atk+")" : ""}</span>`;
    tableRows[8].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.def > 0? "(+"+playerData.rattrs.def+")" : ""}</span>`;
    tableRows[9].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.stm > 0? "(+"+playerData.rattrs.stm+")" : ""}</span>`;
    tableRows[10].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.agi > 0? "(+"+playerData.rattrs.agi+")" : ""}</span>`;
    tableRows[11].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.spd > 0? "(+"+playerData.rattrs.spd+")" : ""}</span>`;
    tableRows[12].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.tec > 0? "(+"+playerData.rattrs.tec+")" : ""}</span>`;
    tableRows[13].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.int > 0? "(+"+playerData.rattrs.int+")" : ""}</span>`;
    tableRows[14].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.lck > 0? "(+"+playerData.rattrs.lck+")" : ""}</span>`;
}

// 檢測是否爲行動裝置。目前已知手機版無法正常查看額外資訊也無法正常觸發通知。
// 由於此腳本涉及請求，避免意料外的狀況，直接避免發送請求應是最穩妥的解法。
// 正規參照：http://detectmobilebrowsers.com/ (2014)
function mobileCheck() {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            check = true;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);

    return check;
};

(async function () {
    'use strict';

    // 調整介面：使導航欄維持在頁面上方
    let root = document.querySelector("div#root");
    let navbar = document.querySelector("div#root > nav");
    let navbarHeight = navbar.offsetHeight;
    root.style.paddingTop = `calc(${navbarHeight}px + 18px)`; // height + margin bottom
    navbar.style.position = "fixed";
    navbar.style.top = "0";

    // 必須是非行動裝置
    if (!mobileCheck()) {
        let frontend = await fetch("https://mykirito.com").then(r => r.text()).then(t => {
            return t.match(/frontend\.[0-9a-f]{8}.js/)[0];
        });
        let cds = await fetch(`https://mykirito.com/${frontend}`).then(r => r.text()).then(t => {
            return t.match(/;var\ .+?(\d\+?e\d);var\ .+?(\d+?e\d);var\ .+?(\d+?e\d);var\ .+?(\d+?e\d)/);
        });
        let token = localStorage.getItem("token");
        let mydata = await fetch("https://mykirito.com/api/my-kirito", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "token": token
            },
            "referrer": "https://mykirito.com/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        }).then(r =>
            r.json()
        );

        let cdChallenge = cds[1] - 0;
        let cdChallengeRed = cds[2] - 0;
        let notificationSeconds = 20;
        let levelExp = [0, 30, 60, 100, 150, 200, 250, 300, 370, 450, 500, 650, 800, 950, 1200, 1450, 1700, 1950, 2200, 2500, 2800, 3100, 3400, 3700, 4000, 4400, 4800, 5200, 5600, 6000, 6500, 7000, 7500, 8000, 8500, 9100, 9700, 10300, 11000, 11800, 12600, 13500, 14400, 15300, 16200, 17100, 18000, 19000, 20000, 21000, 23000, 25000, 27000, 29000, 31000, 33000, 35000, 37000, 39000, 41000, 44000, 47000, 53000];

        document.querySelector("div#root").insertAdjacentHTML("afterend", `<div id="us_customSpace"></div>`);

        if (Notification.permission == "default") {
            Notification.requestPermission();
        }
        if (GM_getValue("NotifiTime") == undefined) {
            GM_setValue("NotifiTime", "-1");
        }

        let url = "";
        let lastUrl = "";
        setInterval(async function () {
            url = location.href;

            if (GM_getValue("NotifiTime") != "-1" && Date.now() > GM_getValue("NotifiTime")) {
                new Notification(`還剩 ${notificationSeconds} 秒左右冷卻就結束了，可以準備打架啦！`);
                GM_setValue("NotifiTime", "-1");
            }

            if (url.includes("profile")) {
                // 在其他玩家頁面
                if (url != lastUrl) {
                    lastUrl = url;

                    let playerId = url.match(/\/([0-9a-zA-Z]+?)$/)[1];
                    let buttonTypes = document.querySelectorAll("div#root > div > div > div:nth-child(1) > button");


                    let playerData = await fetch(`https://mykirito.com/api/profile/${playerId}`, {
                        "headers": {
                            "token": token
                        }
                    }).then(r => r.json()).then(t => t.profile);

                    // 哪個按鈕禁止點擊就表示在哪個查看類型
                    let tableRows;
                    if (buttonTypes[0].disabled) {
                        // （初始化、詳細資料）顯示其他玩家的轉生點加成
                        tableRows = document.querySelectorAll("div#root > div > div > div:nth-child(1) > table tr");
                        addPointsToDetail(tableRows, playerData);
                    } else {
                        // （初始化、能力比對）顯示其他玩家的轉生點加成
                        tableRows = document.querySelectorAll("div#root > div > div > div:nth-child(1) > div > table:nth-child(2) tr");
                        addPointsToCompare(tableRows, playerData);
                    }

                    // 事件監聽：切換查看類型的兩個按鈕
                    buttonTypes[0].addEventListener("click", function () {
                        let id = setInterval(() => {
                            try {
                                let tableRows = document.querySelectorAll("div#root > div > div > div:nth-child(1) > table tr");
                                addPointsToDetail(tableRows, playerData);

                                if (document.querySelectorAll("div#root > div > div > div:nth-child(1) > table tr span").length > 0) {
                                    clearInterval(id);
                                }
                            } catch (e) {}
                        }, 100);
                    });
                    buttonTypes[1].addEventListener("click", function () {
                        let id = setInterval(() => {
                            try {
                                let tableRows = document.querySelectorAll("div#root > div > div > div:nth-child(1) > div > table:nth-child(2) tr");
                                addPointsToCompare(tableRows, playerData);

                                if (document.querySelectorAll("div#root > div > div > div:nth-child(1) > div > table:nth-child(2) tr span").length > 0) {
                                    clearInterval(id);
                                }
                            } catch (e) {}
                        }, 100);
                    });


                    // 事件監聽：打架的四個按鈕
                    let buttons = document.querySelectorAll("div#root > div > div > div:nth-child(2) > div:nth-last-child(1) button");
                    buttons.forEach(button => {
                        button.addEventListener("click", async () => {
                            if (!button.disabled) {
                                let start = Date.now();

                                // TODO: make a cors service by GAS.
                                let color = await fetch("https://mykirito.com/api/my-kirito", {
                                    "headers": {
                                        "accept": "application/json, text/plain, */*",
                                        "token": token
                                    },
                                    "referrer": "https://mykirito.com/",
                                    "referrerPolicy": "no-referrer-when-downgrade",
                                    "body": null,
                                    "method": "GET",
                                    "mode": "cors",
                                    "credentials": "omit"
                                }).then(r =>
                                    r.json()
                                ).then(j =>
                                    j.color
                                );

                                let end = Date.now();
                                if (color == "red") {
                                    let time = Date.now() + cdChallengeRed - (notificationSeconds * 1000) - (end - start);
                                    GM_setValue("NotifiTime", time);
                                    console.log("Notifi reg - R" + (cdChallengeRed - (notificationSeconds * 1000) - (end - start)));
                                } else {
                                    let time = Date.now() + cdChallenge - (notificationSeconds * 1000) - (end - start);
                                    GM_setValue("NotifiTime", time);
                                    console.log("Notifi reg - N" + (cdChallenge - (notificationSeconds * 1000) - (end - start)));
                                }
                            }
                        });
                    });
                }
            } else if (url.match(/https:\/\/mykirito\.com\/?$/)) {
                // 在首頁
                if (url != lastUrl) {
                    lastUrl = url;

                    mydata = await fetch("https://mykirito.com/api/my-kirito", {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "token": token
                        },
                        "referrer": "https://mykirito.com/",
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "body": null,
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "omit"
                    }).then(r =>
                        r.json()
                    );

                    let nowExp = mydata.exp;
                    let nextLevelReq = levelExp[mydata.lv];
                    let expTd = document.querySelector("div#root > div > div:nth-child(1) > div:nth-child(1) > table tr:nth-child(4) > td:nth-child(4)");

                    expTd.innerText = `${nowExp} / ${nextLevelReq}`;
                }

            } else {
                lastUrl = "";
            }
        }, 100);
    } else {
        console.log("這個腳本的查看對手配點與對戰提醒的功能不支援行動裝置");
    }
})();