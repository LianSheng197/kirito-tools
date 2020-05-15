// ==UserScript==
// @name         Kirito Tools
// @namespace    -
// @version      0.3.2
// @description  mykirito.com 的界面調整，不包含任何自動操作。
// @author       LianSheng
// @include      https://mykirito.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// ==/UserScript==

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
                let tableRows = document.querySelectorAll("div#root > div > div > div:nth-child(1) > table tr");

                let playerData = await fetch(`https://mykirito.com/api/profile/${playerId}`, {
                    "headers": {
                        "token": token
                    }
                }).then(r => r.json()).then(t => t.profile);

                // 顯示其他玩家的轉生點加成
                tableRows[4].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.hp * 10})</span>`;
                tableRows[5].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.atk})</span>`;
                tableRows[6].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.def})</span>`;
                tableRows[7].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.stm})</span>`;
                tableRows[8].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.agi})</span>`;
                tableRows[9].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.spd})</span>`;
                tableRows[10].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.tec})</span>`;
                tableRows[11].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.int})</span>`;
                tableRows[12].querySelector("td").innerHTML += `<span color="rgb(0, 181, 181);"> (+${playerData.rattrs.lck})</span>`;

                let buttons = document.querySelectorAll("div#root > div > div > div:nth-child(2) > div:nth-last-child(1) button");

                buttons.forEach(button => {
                    button.addEventListener("click", async () => {
                        if (!button.disabled) {
                            let start = Date.now();

                            // TODO: make a cors service by GAS.
                            let color = await fetch("https://cors-anywhere.herokuapp.com/https://us-central1-kirito-1585904519813.cloudfunctions.net/getMyKiritoFn", {
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