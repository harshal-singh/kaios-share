"use strict";

let categoryCalled = false;

// remove after CROS issue get resolve.
const placeholderTestImage = "https://images.dog.ceo/breeds/cockapoo/george-bow-tie.jpeg";

const placeholderImage = "./images/90x140.png";
const placeholderPageImage = "./images/214x333.png";

// current path
const path = location.pathname;

// alert box
const layer = document.getElementById("layer");
const msgBox = document.getElementById("msg-box");

// loader
function hideLoader() {
    const main = document.querySelector("main");
    const loader = document.getElementById("loader");

    loader.style.top = "100vh";
    setTimeout(() => {
        main.style.opacity = "1";
    }, 1000);

    fetch("http://165.22.223.28/api/manga/total_visitors")
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            document.getElementById("users-count").innerText = obj.visitor;
        })
        .catch((err) => {
            showMsg("LOADING VISITIOR \n\n" + err, true);
        });

    if (path !== "/read.html") {
        // load images
        loadImages();
    }
}

// search
function search() {
    if (path == "/" || path == "/index.html" || path == "/search.html") {
        if (notFocus) {
            notFocus = false;
            searchInput.blur();
            // do search
            let keyword = searchInput.value;

            if (keyword == "") {
                showMsg("SEARCH COMIC \n\n Please enter some keyword, it can't be empty!");
            } else {
                searchComic(keyword);
            }
        } else {
            // take input
            notFocus = true;
            searchInput.focus();
        }
    } else {
        location.href = `/search.html?keyword=all`;
    }
}

// search comics
function searchComic(keyword) {
    fetch(`http://165.22.223.28/api/manga/search?search=${keyword}`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                location.href = `/search.html?keyword=${keyword}`;
            } else if (!obj.success) {
                showMsg("SEARCH COMIC \n\n" + obj.error, true);
            } else {
                showMsg("SEARCH COMIC \n\n Problem with api", true);
            }
        })
        .catch((err) => {
            showMsg("SEARCH COMIC \n\n" + err, true);
        });
}

// get comics by type
function getComicsByType(comic_type) {
    const type = comic_type == "new" ? "recent_comic" : "top_ten_comic";

    fetch(`http://165.22.223.28/api/manga/${type}`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                let comicHTML = "";

                const comics =
                    type == "recent_comic"
                        ? path == "/" || path == "/index.html"
                            ? obj.comic_data.slice(0, 2)
                            : obj.comic_data
                        : path == "/" || path == "/index.html"
                        ? obj.top_ten.slice(0, 2)
                        : obj.top_ten;

                comics.forEach((comic) => {
                    comicHTML += `<a href="comic.html?comic_id=${
                        comic.comic_id
                    }" class="card"><img class="image" src="${placeholderImage}" alt="Spider-Man" data-src="${
                        /* comic.title_img.replace("https", "http")*/ placeholderTestImage
                    }" /><h2 class="title">${comic.comic_title}</h2></a>`;
                });
                document.getElementById(type).innerHTML = comicHTML;
            } else if (!obj.success) {
                showMsg(`GET COMICS BY TYPE: ${type} \n\n` + obj.error, true);
            } else {
                showMsg(`GET COMICS BY TYPE: ${type} \n\n` + "Problem with api", true);
            }
        })
        .then(() => {
            if (!categoryCalled) {
                getCategory();
                categoryCalled = true;
            } else {
                hideLoader();
            }
        })
        .catch((err) => {
            showMsg(`GET COMICS BY TYPE: ${type} \n\n` + err, true);
        });
}

// load image
function loadImages() {
    const images = document.querySelectorAll(".image");
    if (images.length > 0) {
        images.forEach((image) => {
            fetch(image.dataset.src)
                .then((data) => {
                    return data.blob();
                })
                .then((imageBlob) => {
                    const imageUrl = URL.createObjectURL(imageBlob);
                    image.src = imageUrl;
                })
                .catch((err) => {
                    showMsg(err, true);
                });
        });
    } else {
        showMsg("Issue while loading images!", true);
    }
}

// load page image
function loadPageImage(id, datasetURL) {
    const image = document.getElementById(id);
    fetch(datasetURL)
        .then((data) => {
            return data.blob();
        })
        .then((imageBlob) => {
            const imageUrl = URL.createObjectURL(imageBlob);
            image.src = imageUrl;
        })
        .catch((err) => {
            showMsg(err, true);
        });
}

// show message
function showMsg(message, alert) {
    const audio = new Audio("./sounds/notification.mp3");

    const msg = document.getElementById("msg");
    const msgType = document.getElementById("msg-type");

    msgType.innerText = alert ? "💥 New Alert!" : "🔔 New Message";
    msg.innerText = message + "\n\n( Press 9 to close )";

    layer.style.top = "0";
    msgBox.style.transform = "translate(-50%, -50%) scale(1)";

    audio.play();

    document.addEventListener("keypress", hideMsg);
}

// hide message
function hideMsg(e) {
    if (e.key == 9) {
        layer.style.top = "-100vh";
        msgBox.style.transform = "translate(-50%, -50%) scale(0)";

        document.removeEventListener("keypress", hideMsg);
    }
}

// set localStorage
function setLocalStorageItem(name, value) {
    return localStorage.setItem(name, value);
}

// get localStorage
function getLocalStorageItem(name) {
    return localStorage.getItem(name);
}

// get params
function getParams(parma) {
    const search = new URLSearchParams(location.search);
    return search.get(parma);
}

// handle key down
function handleKeyDown(e) {
    switch (e.key) {
        case "SoftLeft":
            search();
            break;

        case "SoftRight":
            window.history.back();
            break;

        case "s":
            search();
            break;

        case "b":
            window.history.back();
            break;
    }
}

document.addEventListener("keydown", handleKeyDown);
