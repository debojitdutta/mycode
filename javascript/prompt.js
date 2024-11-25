/**
 * Class responsible for managing light and dark mode.
 * @constructor
 */
function Mode() {
    /**
     * Toggles between light and dark mode icons.
     * @param {HTMLElement} mode - The mode icon element.
     */
    const toggleModeIcon = (mode) => {
        mode.innerText = mode.innerText === "dark_mode" ? "light_mode" : "dark_mode";
    };


    const modifyColors = () => {
        document.body.classList.toggle("light-mode");
    };

    /**
     * Saves the current theme mode to localStorage.
     * @param {boolean} isLightMode - Whether the current mode is light mode.
     */
    const saveModeToLocalStorage = (isLightMode) => {
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
    };

    /**
     * Loads the saved theme mode from localStorage when the page loads.
     */
    const loadModeFromLocalStorage = () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            document.body.classList.add("light-mode");
            this.modeBtn.children[0].innerText = "light_mode";
        } else {
            document.body.classList.remove("light-mode");
            this.modeBtn.children[0].innerText = "dark_mode";
        }
    };


    const modeBtnClicked = () => {
        toggleModeIcon(this.modeBtn.children[0]);
        modifyColors();
        const isLightMode = document.body.classList.contains("light-mode");
        saveModeToLocalStorage(isLightMode);
    };

    this.modeBtn = document.getElementById("mode");
    this.modeBtn.addEventListener("click", modeBtnClicked);

    loadModeFromLocalStorage();
}

const modeObj = new Mode();
