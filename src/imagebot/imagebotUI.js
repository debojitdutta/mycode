const video = document.getElementById("video");
const image = document.getElementById("image");

export function showWaitingVideo() {
    image.style.display = "none";
    video.style.display = "block";
    video.play();
}

export function showGeneratedImage() {
    image.style.display = "block";
    video.style.display = "none";
}
