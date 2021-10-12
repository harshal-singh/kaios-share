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
        error.textContent = "Success Pick!";
    };

    // if error in picking image from gallery and camera
    pickImageActivity.onerror = function () {
        error.textContent = "Unsuccess Pick!";
    };
}

// share image
function sharing() {
    var sharing = new MozActivity({
        name: "share",
        data: {
            type: "text/plain",
            blobs: ["This is a message to share via WhatsApp"],
        },
    });

    // if image successfully picked
    sharing.onsuccess = function () {
        error.textContent = "Success share!";
    };

    // if error in picking image from gallery and camera
    sharing.onerror = function () {
        error.textContent = "Unsuccess share!";
    };
}

button.onclick = (e) => {
    e.preventDefault();
    button.style.background = "green";
    sharing();
};

pickimage.onclick = (e) => {
    e.preventDefault();
    pickimage.style.background = "green";
    pick();
};
