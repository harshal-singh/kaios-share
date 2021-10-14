const body = document.querySelector("body");
const error = document.getElementById("error");
const btnShare = document.getElementById("share");
const btnShareText = document.getElementById("share-text");
const btnShareImage = document.getElementById("share-image");
const btnShareImageText = document.getElementById("share-image-text");
const image1 = "https://image.freepik.com/free-photo/blue-concrete-wall-textures-background_74190-7757.jpg";
const image2 = "https://image.freepik.com/free-vector/flat-design-red-comic-style-background_23-2148797742.jpg";

btnShare.onclick = (e) => {
    e.preventDefault();
    btnShare.style.background = "red";
    share();
};

btnShareText.onclick = (e) => {
    e.preventDefault();
    btnShareText.style.background = "blue";
    shareText(image1);
};

btnShareImage.onclick = (e) => {
    e.preventDefault();
    btnShareImage.style.background = "green";
    shareImage(image1, image2);
};

btnShareImageText.onclick = (e) => {
    e.preventDefault();
    btnShareImageText.style.background = "yellow";
    shareImageText("https://img.freepik.com/free-vector/abstract-yellow-comic-zoom_1409-923.jpg?size=626&ext=jpg");
};

// chrome share image
function share(url) {
    fetch(url)
        .then((data) => {
            return data.blob();
        })
        .then((imgBlob) => {
            const image = new File([imgBlob], "share-image.jpg", { type: "image/jpeg" });
            const textBlob = new Blob(["https://harshal-singh.github.io/stop-watch"], { type: "text/plain" });
            const text = new File([textBlob], "share-image.jpg", { type: "image/jpeg" });
            const filesArray = [image, text];
            const shareData = { files: filesArray };

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
function shareImage(url1, url2) {
    const image1Blob = fetch(url1)
        .then((data) => {
            return data.blob();
        })
        .catch((err) => {
            error.textContent = err;
        });

    const image2Blob = fetch(url2)
        .then((data) => {
            return data.blob();
        })
        .catch((err) => {
            error.textContent = err;
        });

    // share image
    var shareImage = new MozActivity({
        name: "share",
        data: {
            type: ["image/*"],
            number: 1,
            blobs: [image1Blob, image2Blob],
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
}

function shareText() {
    // share text
    const textBlob = new Blob(["https://harshal-singh.github.io/stop-watch"], { type: "text/plain" });
    var shareText = new MozActivity({
        name: "share",
        data: {
            type: "text/plain",
            blobs: [textBlob],
        },
    });

    // text share successfully
    shareText.onsuccess = function () {
        error.textContent = "Success share text!";
        body.style.backgroundImage = `linear-gradient(to top left, orangered, orangered)`;
    };

    // error in sharing text
    shareText.onerror = function (err) {
        error.textContent = this.error;
    };
}
