/*
    This script is responsible to switch between the dark mode and light mode. Default is dark mode.
    Also remember the mode in which user closed the site last time and enable it by default
*/

// Note: modeBtn is the parent div. The icon is present inside this div as a div element.
// So to get the icon element we need to fetch the children element of modeBtn.
// Refer to main.html file for more reference
const modeBtn = document.getElementById('mode');
modeBtn.addEventListener('click', modeBtnClicked);


/**
 * Loads the saved theme mode from localStorage when the page loads.
 * @IIFE as it is to be automatically loaded 
 */
(function loadModeFromLocalStorage() {

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {

        document.body.classList.add("light-mode");
        modeBtn.children[0].innerText = "light_mode";

    } else {

        document.body.classList.remove("light-mode");
        modeBtn.children[0].innerText = "dark_mode";
        
    }

})()


/**
 * Responsible to change the mode text for the html element
 * @param {string} mode the current mode (light_mode/dark_mode)
 */
function toggleModeIcon(mode) {
    mode.innerText = mode.innerText === "dark_mode" ? "light_mode" : "dark_mode";
}


/**
 * update the class to trigger the colors from css file.
 * if body doesn't have any class dark mode colors are set. So here we set light-mode as body's class to trigger the light mode colors
 */
function modifyColors() {
    document.body.classList.toggle("light-mode");
}


/**
 * To save the current mode in local storage so that it can remember the state upon website refresh/revisit
 * @param {boolean} isLightMode true if light mode else false.
 */
function saveModeToLocalStorage(isLightMode) {
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
}


/**
 * Handles the click event of the mode button. Performs the following tasks.
 * 1. Change the mode icon i.e. change the inner text of the icon element to update the icon.
 * 2. Modify the colors. To update the colors, we toggle the 'light-mode' class on body element
 * 3. Save the current mode to local storage.
 */
function modeBtnClicked() {

    toggleModeIcon(modeBtn.children[0]);
    modifyColors();

    const isLightMode = document.body.classList.contains("light-mode");
    saveModeToLocalStorage(isLightMode);

}
