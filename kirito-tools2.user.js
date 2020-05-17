// ==UserScript==
// @name         Kirito Tools
// @namespace    -
// @version      0.3.4
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

(async function () {
    'use strict';

    let frontend = await fetch("https://mykirito.com").then(r => r.text()).then(t => {
        return t.match(/frontend\.[0-9a-f]{8}.js/)[0];
    });
    let cds = await fetch(`https://mykirito.com/${frontend}`).then(r => r.text()).then(t => {
        return t.match(/;var\ .+?(\d\+?e\d);var\ .+?(\d+?e\d);var\ .+?(\d+?e\d);var\ .+?(\d+?e\d)/);
    });

    let cdChallenge = cds[1] - 0;
    let cdChallengeRed = cds[2] - 0;
    let notificationSeconds = 20;

    document.querySelector("div#root").insertAdjacentHTML("afterend", `<div id="us_customSpace"></div>`);

    let root = document.querySelector("div#root");
    root.style.paddingTop = "calc(48px + 18px)"; // height + margin bottom
    let navbar = document.querySelector("div#root > nav");
    navbar.style.position = "fixed";
    navbar.style.top = "0";

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

        // 在玩家頁面
        if (url.includes("profile")) {
            // 確保只執行一次
            if (url != lastUrl) {
                lastUrl = url;

                let token = localStorage.getItem("token");
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
        } else {
            lastUrl = "";
        }
    }, 100);
})();