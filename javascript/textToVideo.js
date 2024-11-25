// Class to handle video generation
class VideoGeneration {
    constructor() {
        this.token = "1b08d6d041b404a88b5c67460a056f4e5"; // API Key
        this.apiUrl = "https://api.aivideoapi.com/v1/generate_by_text_runway_generate_text_post";
        this.videoElement = document.getElementById("generatedvideo");
        this.loadingTimer = document.getElementById("timer");
    }

    // API call to generate video
    async query(prompt) {
        const payload = {
            text_prompt: prompt,
            model: "gen3",
            width: 1344,
            height: 768,
            motion: 5,
            seed: 0,
            callback_url: "",
            time: 5
        };

        this.toggleLoading(true);

        try {
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const videoUrl = data.output_url; // Assuming API returns video URL

            this.displayVideo(videoUrl);
        } catch (error) {
            console.error("Error generating video:", error);
            alert("Failed to generate video. Please try again.");
        } finally {
            this.toggleLoading(false);
        }
    }

    // Display video on the page
    displayVideo(videoUrl) {
        this.videoElement.src = videoUrl;
        this.videoElement.style.display = "block";
        this.videoElement.play();
        console.log("Video displayed successfully.");
    }

    // Toggle loading state
    toggleLoading(isLoading) {
        this.loadingTimer.textContent = isLoading
            ? "Generating, please wait..."
            : "Video ready!";
    }
}

// Action handler for user interactions
class Action {
    constructor() {
        this.videoGeneration = new VideoGeneration();
        this.promptElement = document.getElementById("prompt");
        this.actionBtn = document.getElementById("action-btn");
        this.actionIcon = document.getElementById("action-icon");

        this.addEventListeners();
    }

    // Event listeners for button actions
    addEventListeners() {
        this.actionBtn.addEventListener("click", () => this.handleAction());
        this.actionIcon.addEventListener("click", () => this.handleAction());
    }

    // Handle action button click
    handleAction() {
        const promptValue = this.getPromptValue();
        if (promptValue) {
            this.videoGeneration.query(promptValue);
        } else {
            alert("Please enter a text prompt!");
        }
    }

    // Get the value from the text prompt
    getPromptValue() {
        return this.promptElement.value.trim();
    }
}

// Initialize the video generation functionality
document.addEventListener("DOMContentLoaded", () => {
    new Action();
});
