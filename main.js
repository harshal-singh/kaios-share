const body = document.querySelector("body");
const error = document.getElementById("error");
const btnShare = document.getElementById("share");
const btnShareText = document.getElementById("share-text");
const btnShareImage = document.getElementById("share-image");
const btnShareImageText = document.getElementById("share-image-text");

const textBlob = new Blob(["https://harshal-singh.github.io/stop-watch"], { type: "text/plain" });

btnShare.onclick = (e) => {
    e.preventDefault();
    btnShare.style.background = "red";
    share("https://image.freepik.com/free-vector/flat-design-red-comic-style-background_23-2148797742.jpg");
};

btnShareText.onclick = (e) => {
    e.preventDefault();
    btnShareText.style.background = "blue";
    shareText();
};

btnShareImage.onclick = (e) => {
    e.preventDefault();
    btnShareImage.style.background = "green";
    shareImage("https://image.freepik.com/free-photo/blue-concrete-wall-textures-background_74190-7757.jpg");
};

btnShareImageText.onclick = (e) => {
    e.preventDefault();
    btnShareImageText.style.background = "brown";
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
            const text = new File([textBlob], "share-text.txt", { type: "text/plain" });
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
            // share image
            var shareImage = new MozActivity({
                name: "share",
                data: {
                    type: "image/*",
                    // number: 1,
                    blobs: [imageBlob],
                },
            });

            // image share successfully
            shareImage.onsuccess = function () {
                error.textContent = "Success share image!";
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
    };

    // error in sharing text
    shareText.onerror = function () {
        error.textContent = this.error;
    };
}

function shareImageText(url) {
    fetch(url)
        .then((data) => {
            return data.blob();
        })
        .then((imageBlob) => {
            fetch("/sound.wav")
                .then((data) => {
                    return data.blob();
                })
                .then((soundBlod) => {
                    let shareImageText = new MozActivity({
                        //Name of activity that set the ringtone
                        name: "share",
                        data: {
                            //Type of file, in that case acept all audio formats
                            // type: "audio/*",
                            number: 1,
                            //The blob object of audio file, must be within in array
                            blobs: [soundBlod],
                            //The metadata of audio, these are the 3 available properties
                            metadata: [
                                {
                                    title: "Umbrella",
                                    artist: "Rihanna",
                                    //The picture must be blob object
                                    picture: imageBlob,
                                },
                            ],
                        },
                    });

                    //Success handler
                    shareImageText.onsuccess = function () {
                        error.textContent = "Success share image and text!";
                    };

                    //Error handler
                    shareImageText.onerror = function () {
                        error.textContent = this.error;
                    };
                })
                .catch((err) => {
                    error.textContent = "Sound: " + err;
                });
        })
        .catch((err) => {
            error.textContent = "Image: " + err;
        });
}
