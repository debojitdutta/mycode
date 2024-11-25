var leftContainers = document.querySelector(".left-container");
function moreBtnToggle() {
    leftContainers.classList.toggle("left-container-height");
}



// Adjusted ImageGeneration class
function ImageGeneration() {
    const token = "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";
    const video = document.getElementById("video");
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

    const displayImage = () => {
        image.style.display = "block";
        video.style.display = "none";
    };

    this.generateImage = (value) => {
        console.log("Generating image...");
        query(value).then((response) => {
            const objectURL = URL.createObjectURL(response);
            displayImage();
            image.src = objectURL;
            console.log("Image generated successfully.");
        }).catch((error) => {
            console.error("Error generating image:", error);
        });
    };
}

// Adjusted Action class
function Action() {
    const imageGeneration = new ImageGeneration();

    const showWaitingVideo = () => {
        image.style.display = "none";
        video.style.display = "block";
        video.play();
    };

    this.sendBtnClicked = () => {
        const promptValue = getPromptValue();
        if (promptValue) {
            showWaitingVideo();
            imageGeneration.generateImage(promptValue);
        }
    };

    const actionBtnClicked = (e) => {
        const icon = e.target.closest("button").children[0];

        if (icon.classList.contains("fa-microphone")) {
            console.log("Microphone functionality not implemented.");
        } else if (icon.classList.contains("fa-paper-plane")) {
            this.sendBtnClicked();
        } else {
            console.log("Reset functionality not implemented.");
        }
    };

    const getPromptValue = () => {
        return prompt.value.trim();
    };

    this.changeActionIcon = (currIcon, newIcon) => {
        if (actionIcon.classList.contains(currIcon)) {
            actionIcon.classList.remove(currIcon);
            actionIcon.classList.add(newIcon);
        }
    };

    const actionIconClicked = (e) => {
        e.stopPropagation();
        actionBtnClicked(e);
    };

    const actionBtn = document.getElementById("action-btn");
    const actionIcon = document.getElementById("action-icon");
    const prompt = document.getElementById("prompt");
    const video = document.getElementById("video");
    const image = document.getElementById("image");

    actionIcon.addEventListener("click", actionIconClicked);
    actionBtn.addEventListener("click", actionBtnClicked);
}

// Adjusted Prompt class
function Prompt() {
    const action = new Action();
    const prompt = document.getElementById("prompt");

    const promptModified = (e) => {
        if (prompt.value.trim()) {
            action.changeActionIcon("fa-microphone", "fa-paper-plane");
        } else {
            action.changeActionIcon("fa-paper-plane", "fa-microphone");
        }

        if (e.inputType === "insertLineBreak" && prompt.value.trim()) {
            e.preventDefault();
            action.sendBtnClicked();
        }
    };

    prompt.addEventListener("input", promptModified);
}

// Adjusted Mode class
function Mode() {
    const modeBtn = document.getElementById("mode");
    const toggleModeIcon = () => {
        const icon = modeBtn.children[0];
        icon.innerText = icon.innerText === "dark_mode" ? "light_mode" : "dark_mode";
    };

    const modifyColors = () => {
        document.body.classList.toggle("light-mode");
    };

    const saveModeToLocalStorage = (isLightMode) => {
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
    };

    const loadModeFromLocalStorage = () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            document.body.classList.add("light-mode");
            modeBtn.children[0].innerText = "light_mode";
        } else {
            document.body.classList.remove("light-mode");
            modeBtn.children[0].innerText = "dark_mode";
        }
    };

    const modeBtnClicked = () => {
        toggleModeIcon();
        modifyColors();
        const isLightMode = document.body.classList.contains("light-mode");
        saveModeToLocalStorage(isLightMode);
    };

    modeBtn.addEventListener("click", modeBtnClicked);
    loadModeFromLocalStorage();
}

// Initialize classes
document.addEventListener("DOMContentLoaded", () => {
    new Prompt();
    new Mode();
});



// below classs respomsilble for downloading content
//doesnt work

class ImageDownloader {
    constructor(downloadButtonSelector, imageSelector) {
        this.downloadButton = document.querySelector(downloadButtonSelector);
        this.imageElement = document.querySelector(imageSelector);

        // Initialize the event listener
        this.init();
    }

    // Initialize the event listener for the download button
    init() {
        if (this.downloadButton && this.imageElement) {
            this.downloadButton.addEventListener("click", () => this.downloadImage());
        } else {
            console.error("Download button or image element not found!");
        }
    }

    // Function to handle image download
    downloadImage() {
        const imageUrl = this.imageElement.src; // Get the image source
        const fileName = this.getFileName(imageUrl); // Extract the filename
        this.triggerDownload(imageUrl, fileName);
    }

    // Helper function to get the file name from the URL
    getFileName(url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    // Function to trigger the download
    triggerDownload(url, fileName) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor); // Append the anchor to the body
        anchor.click(); // Trigger the download
        document.body.removeChild(anchor); // Remove the anchor after download
    }
}

// Instantiate the ImageDownloader class
new ImageDownloader(".fa-download", "#image");






/* niche wala PageController class chatGpt se liya hai bhai mujhe nhi malum kuch!!!*/

// class responsible for changing mode across the website...

/* Also includes classes responsible for icons in the middle constainer,
 Icon functions liking the image, sharing the image, expand the image and downloading image */

class PageController {
    constructor() {
      this.body = document.body;
      this.modeToggle = document.querySelector('.mode');
      this.thumbsUp = document.querySelector('.fa-thumbs-up');
      this.share = document.querySelector('.fa-share');
      this.expand = document.querySelector('.fa-expand');
      this.download = document.querySelector('.fa-download');
      this.deleteIcons = document.querySelectorAll('.delete-icon');
      
      this.darkModeEnabled = this.initializeTheme();
      this.setupEventListeners();
    }
  
    // Initialize theme from localStorage
    initializeTheme() {
      const savedMode = localStorage.getItem('theme');
      const isDarkMode = savedMode === 'dark' || savedMode === null;
      if (!isDarkMode) {
        this.body.classList.add('light-mode');
        this.updateModeIcon('light_mode');
      }
      return isDarkMode;
    }
  
    // Update theme toggle icon
    updateModeIcon(iconName) {
      const modeIcon = this.modeToggle.querySelector('.material-symbols-outlined');
      modeIcon.innerText = iconName;
    }
  
    // Toggle dark/light mode
    toggleMode() {
      this.darkModeEnabled = !this.darkModeEnabled;
      this.body.classList.toggle('light-mode');
      const theme = this.darkModeEnabled ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      this.updateModeIcon(this.darkModeEnabled ? 'dark_mode' : 'light_mode');
    }
  
    // Set up all event listeners
    setupEventListeners() {
      this.modeToggle.addEventListener('click', () => this.toggleMode());
  
      this.thumbsUp.addEventListener('click', () => {
        alert('You liked this image!');
      });
  
      this.share.addEventListener('click', () => {
        alert('Image shared!');
      });
  
      this.expand.addEventListener('click', () => this.toggleExpandImage());
  
      this.download.addEventListener('click', () => {
        alert('Download started!');
      });
  
      this.deleteIcons.forEach(icon =>
        icon.addEventListener('click', (e) => this.deleteImage(e))
      );
    }
  
    // Toggle image expansion
    toggleExpandImage() {
      const imageBox = document.querySelector('.image-box img');
      imageBox.classList.toggle('expanded');
      if (imageBox.classList.contains('expanded')) {
        imageBox.style.width = '100%';
        imageBox.style.height = 'auto';
        // imageBox.style.overflow = 'auto';
        // imageBox.style.position = 'absolute';
        // imageBox.style.top = '0';
      } else {
        imageBox.style.width = '100%';
        imageBox.style.height = '100%';
        // imageBox.style.overflow = 'hidden';

        // imageBox.style.position = 'relative';
      }
    }
  
    // Delete an image
    deleteImage(event) {
      const imageWrapper = event.target.closest('.image-wrapper');
      imageWrapper.remove();
    }
  }
  
  // Instantiate the PageController class once the DOM is fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    new PageController();
  });
  