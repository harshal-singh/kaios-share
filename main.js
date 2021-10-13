const body = document.querySelector("body");
const button = document.getElementById("share");
const error = document.getElementById("error");
const pickimage = document.getElementById("pick-img");

// share image
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

// pick image
function pick() {
    // registering new mozActivity to pick image file of only following type
    var pickImageActivity = new MozActivity({
        name: "pick",
        data: {
            type: ["image/png", "image/jpg", "image/jpeg"],
        },
    });

    // if image successfully picked
    pickImageActivity.onsuccess = function () {
        error.textContent = this.result;
        const imgSrc = this.result.blob;
        body.style.backgroundImage = `url("${imgSrc}")`;
    };

    // if error in picking image from gallery and camera
    pickImageActivity.onerror = function () {
        error.textContent = this.error;
    };
}

// share image
function sharing(url) {
    fetch(url)
        .then((data) => {
            return data.blob();
        })
        .then((imageBlob) => {
            var sharing = new MozActivity({
                name: "share",
                data: {
                    // type: "image/*",
                    number: 1,
                    blobs: [imageBlob],
                    url: encodeURI("hello, share this pic!"),
                },
            });

            // if image successfully picked
            sharing.onsuccess = function () {
                error.textContent = "Success share!";
                const objectURL = URL.createObjectURL(imageBlob);
                body.style.backgroundImage = `url("${objectURL}")`;
            };

            // if error in picking image from gallery and camera
            sharing.onerror = function () {
                error.textContent = this.error;
            };
        })
        .catch((err) => {
            error.textContent = err;
        });
}

button.onclick = (e) => {
    e.preventDefault();
    button.style.background = "green";
    sharing("https://images.dog.ceo/breeds/bulldog-boston/n02096585_9681.jpg");
};

pickimage.onclick = (e) => {
    e.preventDefault();
    pickimage.style.background = "green";
    pick();
};