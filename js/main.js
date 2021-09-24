const button = document.getElementById("share");

// download image
function share(url, imageName) {
    fetch(url)
        .then((data) => {
            return data.blob();
        })
        .then((imgBlob) => {
            const myImage = document.createElement("img");
            const objectURL = URL.createObjectURL(imgBlob);
            myImage.src = objectURL;

            // const a = document.createElement("a");
            // a.setAttribute("download", imageName);
            // a.setAttribute("href", objectURL);

            const a = `<a href="whatsapp://send?text=${encodeURIComponent(objectURL)}">Share on whatsapp!</a>`;
            document.querySelector("body").insertAdjacentHTML("beforeend", a);
        })
        .catch((err) => {
            console.log(err);
        });
}

button.onclick = (e) => {
    e.preventDefault();
    share(
        "https://preview.redd.it/d8yptqej6hl71.jpg?width=320&crop=smart&auto=webp&s=582876a7037f7422790ef8a5e3977c8b7f3f392d",
        "gorilla"
    );
};
