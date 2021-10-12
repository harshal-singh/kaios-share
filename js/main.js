"use strict";

const token = getLocalStorageItem("token");
let total_count = getLocalStorageItem("total_count") ? Number(getLocalStorageItem("total_count")) : 1;

if (!navigator.onLine) {
    $("#popup").css("display", "grid");
    $("#popup_msg").html("<div id='no-internet'><p>No Internet!</p>Please connect to internet!</div>");
} else {
    $("#popup").css("display", "none");

    if (token) {
        userInfo(token);
        showMsg("Old user...");
    } else {
        register();
        showMsg("New user...");
    }
}

function register() {
    const device = navigator.userAgent;

    //  get user ip address
    $.getJSON("https://api.ipify.org?format=json").then((ipData) => {
        fetch("https://kaiosapi.quadbtech.com/api/memer/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                ip_address: ipData.ip,
                device: device,
            }),
        })
            .then((data) => {
                return data.json();
            })
            .then((obj) => {
                if (obj.status == "fail") {
                    $("#error").fadeIn();
                    $("#error").html(obj.Error);
                } else {
                    $("#error").fadeOut();
                    const token = obj["created_data"].token;
                    setLocalStorageItem("token", token);
                    userInfo(token);

                    showInstructions();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

// get user info
function userInfo(token) {
    if (token) {
        fetch(`https://kaiosapi.quadbtech.com/api/memer/user_info?token=${token}`)
            .then((obj) => {
                return obj.json();
            })
            .then((data) => {
                if (data.status == "fail") {
                    $("#popup").css("display", "grid");

                    $("#popup_msg").html(data.Error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("total_count");
                    localStorage.removeItem("check_appearance_order");
                    location.reload();
                } else if (data.status == "success") {
                    $("#user_name").html("Hi user!, let's enjoy the memes.");
                    // get memes
                    getMemes(token);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        alert("ERROR");
    }
}

// get memes
function getMemes(token) {
    showMsg("Getting memes...");

    let check_appearance_order = Number(getLocalStorageItem("check_appearance_order")) || 0;

    fetch("https://kaiosapi.quadbtech.com/api/memer/meme_calculate", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            token: token,
            appearance_order: check_appearance_order,
            current_meme: total_count,
        }),
    })
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            showMsg("Fetched all memes...");

            if (obj.reset) {
                setLocalStorageItem("check_appearance_order", 2);
            } else {
                setLocalStorageItem("check_appearance_order", check_appearance_order + 1);
            }

            const memes = obj["data"];

            let i = 0;
            let forward = 0;
            let backward = 0;
            $("#meme_image").css("background-image", "url(" + url(memes, i) + ")");
            document.addEventListener("keyup", (e) => {
                if (e.key == "ArrowRight" || e.key == 39) {
                    forward++;
                    backward--;
                    total_count++;
                    i == memes.length - 1 ? (i = 0) : i++;
                    $("#meme_image").css("background-image", "url(" + url(memes, i) + ")");

                    setLocalStorageItem("total_count", total_count);
                } else if (e.key == "ArrowLeft" || e.key == 37) {
                    forward--;
                    backward++;
                    total_count++;
                    i > 0 ? i-- : (i = memes.length - 1);
                    $("#meme_image").css("background-image", "url(" + url(memes, i) + ")");

                    setLocalStorageItem("total_count", total_count);
                } else if (e.key == "Enter" || e.key == 13) {
                    $("#tooltip-overlay").css("display", "none");
                    share(url(memes, i));
                }

                if (forward == memes.length - 1 || backward == memes.length - 1) {
                    getMemes(token);
                }
            });

            $.ajax({
                type: "GET",
                url: "https://kaiosapi.quadbtech.com/api/memer/total_visitors",
                dataType: "json",
                success: (obj) => {
                    $("#visitor").html(obj.visitor);
                },
                error: (err) => {
                    console.log(err);
                },
            });
        })
        .catch((err) => {
            showMsg(err);
        });
}

// get url of image
function url(memes, i) {
    let imgURL = memes[i].preview;
    return imgURL;
}

// share image
function share(url) {
    fetch("https://kaiosapi.quadbtech.com/api/memer/download", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            urls: url,
        }),
    })
        .then((data) => {
            return data.blob();
        })
        .then((imageBlob) => {
            var sharing = new MozActivity({
                name: "share",
                data: {
                    type: "image/*",
                    number: 1,
                    blobs: [imageBlob],
                },
            });

            // if image successfully shared
            sharing.onsuccess = function () {
                showMsg("Share was successful.");
            };

            // if error in sharing image
            sharing.onerror = function () {
                showMsg("Something went wrong while sharing!");
            };
        })
        .catch((err) => {
            showMsg("Sharing is not supported by your device!");
        });
}

// show instructions
function showInstructions() {
    $("#popup").css("display", "grid");
    $("#popup_msg").html(
        "<div><span style='margin-bottom: 16px;'>Let's Get Started</span><span>Know how to use memer app.</span></div>"
    );

    setTimeout(() => {
        $("#popup").css("display", "none");

        $("#tooltip-overlay").css("display", "grid");

        let left = false;
        document.addEventListener("keydown", (e) => {
            let text;
            if ((e.key == "ArrowRight" && left) || e.key == 39 || left) {
                text = "Click OK Button <br /> To Share Current meme.";
            } else if (e.key == "ArrowLeft" || e.key == 37) {
                text = "Click Right Arrow <br /> To view Next meme.";
                left = true;
            }
            $("#tooltip").html(text);
        });
    }, 2500);
}

// show message
function showMsg(msg) {
    $("#popup").css("display", "grid");
    $("#popup_msg").html(msg);

    setTimeout(() => {
        $("#popup").css("display", "none");
    }, 2500);
}

// set localStorage
function setLocalStorageItem(name, value) {
    return localStorage.setItem(name, value);
}

// get localStorage
function getLocalStorageItem(name) {
    return localStorage.getItem(name);
}
