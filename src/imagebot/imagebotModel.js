import * as imagebotUI from "../imagebot/imagebotUI.js";

const token = "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";
const image = document.getElementById("image");

async function query(value) {
    const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: JSON.stringify({ inputs: value })
    });
    const result = await response.blob();
    return result;
}


export function generateImage(value) {
    console.log("Generating image...");
    query(value).then((response) => {
        const objectURL = URL.createObjectURL(response);
        imagebotUI.showGeneratedImage();
        image.src = objectURL;
        console.log("Image generated successfully.");
    }).catch((error) => {
        console.error("Error generating image:", error);
    });
};
