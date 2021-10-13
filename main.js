const body = document.querySelector("body");
const button = document.getElementById("share");
const error = document.getElementById("error");
const pickimage = document.getElementById("pick-img");

// chrome share image
function share(url) {
    fetch(url)
        .then((data) => {
            return data.blob();
        })
        .then((imgBlob) => {
            var file = new File([imgBlob], "share-image.jpg", { type: "image/jpeg" });
            var filesArray = [file];
            var shareData = { files: filesArray };

            if (navigator.canShare && navigator.canShare(shareData)) {
                navigator
                    .share(shareData)
                    .then(() => (error.textContent = "Share was successful."))
                    .catch((err) => (error.textContent = "Sharing failed: " + err));
            } else {
                error.textContent = "Your system doesn't support sharing files.";
            }
        })
        .catch((err) => {
            error.textContent = err;
        });
}

// mozilla share image
function shareImage(url) {
    fetch(url)
        .then((data) => {
            return data.blob();
        })
        .then((imageBlob) => {
            // share image
            var shareImage = new MozActivity({
                name: "share",
                data: {
                    type: "image/*",
                    number: 1,
                    blobs: [imageBlob],
                },
            });

            // image share successfully
            shareImage.onsuccess = function () {
                error.textContent = "Success share image!";
                body.style.backgroundImage = `linear-gradient(to top left, yellow, yellow)`;
            };

            // error in sharing image
            shareImage.onerror = function () {
                error.textContent = this.error;
            };
        })
        .catch((err) => {
            error.textContent = err;
        });
}

function shareText() {
    // share text
    const text = encodeURI("https://harshal-singh.github.io/stop-watch");
    var shareText = new MozActivity({
        name: "share",
        data: {
            type: "url",
            number: 1,
            url: text,
        },
    });

    // text share successfully
    shareText.onsuccess = function () {
        error.textContent = "Success share text!";
        body.style.backgroundImage = `linear-gradient(to top left, red, red)`;
    };

    // error in sharing text
    shareText.onerror = function (err) {
        error.textContent = this.error + err;
    };
}

button.onclick = (e) => {
    e.preventDefault();
    button.style.background = "green";
    shareImage("https://images.dog.ceo/breeds/bulldog-boston/n02096585_9681.jpg");
};

pickimage.onclick = (e) => {
    e.preventDefault();
    pickimage.style.background = "green";
    shareText();
};
