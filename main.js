const error = document.getElementById("error");
const btnShare = document.getElementById("share");

const image = "https://image.freepik.com/free-photo/blue-concrete-wall-textures-background_74190-7757.jpg";

btnShare.onclick = (e) => {
    e.preventDefault();
    btnShare.style.background = "green";
    shareImage(image);
};

// chrome share image & text
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
function shareImage(url) {
    fetch(url)
        .then((data) => {
            return data.blob();
        })
        .then((imageBlob) => {
            const textBlob = new Blob([text], { type: "text/plain" });

            // share image
            var shareImage = new MozActivity({
                name: "share",
                data: {
                    type: "image/*",
                    number: 1,
                    blobs: [imageBlob],
                    type: "text/plain",
                    blobs: [textBlob],
                },
            });

            // image share successfully
            shareImage.onsuccess = function () {
                error.textContent = "Success share image!";
                body.style.backgroundColor = `royalblue`;
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

// mozilla share text
function shareText(text) {
    // share text
    const textBlob = new Blob([text], { type: "text/plain" });
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
        body.style.backgroundColor = `royalblue`;
    };

    // error in sharing text
    shareText.onerror = function (err) {
        error.textContent = this.error;
    };
}
