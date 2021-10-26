"use strict";

const msg = document.getElementById("msg");
const shareBtn = document.getElementById("share-btn");
const imageUrl = document.querySelector("img").getAttribute("src");

shareBtn.onclick = () => {
    share(imageUrl);
};

document.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        share(imageUrl);
    }
});

// share image
function share(url) {
    fetch("https://images.dog.ceo/breeds/cotondetulear/IMAG1063.jpg")
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
                msg.innerText = "Shared image successfully";
            };

            // if error in sharing image
            sharing.onerror = function () {
                msg.innerText = "SHARING \n" + this.error;
            };
        })
        .catch((err) => {
            msg.innerText = "FETCH ERROR \n" + err;
        });
}
