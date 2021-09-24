const button = document.getElementById("share");
const error = document.getElementById("error");

// download image
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
                // Adding title afterwards as navigator.canShare just
                // takes files as input
                // shareData.title = "Name";

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

button.onclick = (e) => {
    e.preventDefault();
    button.style.background = "green";
    share("https://images.dog.ceo/breeds/weimaraner/n02092339_3979.jpg");
    error.textContent = "click";
};
