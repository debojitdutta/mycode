/*
    This script handles all prompt related operations.
    Modifying the prompt, the send button, the microphone button.
*/

import * as chatbotUI from "../chatbot/chatbotUI.js";
import { modifyPrompt } from "./promptInputModifier.js";
import { generateResponse } from "../chatbot/chatbotModel.js";

// action button holds the microphone and the send button icon 
const actionBtn = document.getElementById('actionBtn');

// the input box, inside which user enters the query
const promptBox = document.getElementById('prompt');

actionBtn.addEventListener('click', actionBtnClicked);

// trigger action button click when user presses enter when prompt is focused
promptBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        actionBtn.click();
    }
})

// Listen for typing in the prompt box to change the icon to send button
// or change to microphone icon if prompt is made empty
promptBox.addEventListener('input', () => {
    if (promptBox.value.trim() !== '') {
        // Change microphone icon to send button
        actionBtn.children[0].classList.replace('fa-microphone', 'fa-paper-plane');
    } else {
        // Change back to the microphone if the input is empty
        actionBtn.children[0].classList.replace('fa-paper-plane', 'fa-microphone');
    }
});


/**
 * Responsible to find out whether the microphone button was clicked or the send button
 * @param {Event} e 
 */
function actionBtnClicked(e) {
    // Find the closest button element, whether clicking the button or any child element
    const button = e.target.closest('button');

    if (!button) return; // Exit if no button found in parent chain

    const icon = button.querySelector('i');

    if (icon.classList.contains('fa-microphone')) {
        microphoneBtnClicked();
    } else {
        sendBtnClicked();
    }
}

/**
 * To create a popup box when the microphone icon is clicked. 
 * The popup icon may be `listening` or `no voice recognized`.
 * 
 * @param {boolean} listening if true, displays `listening` popup otherwise displays `error: no voice recognized popup`
 * @returns {HTMLElement} the popup element
 */
function microphoneUI(listening = true) {
    // Create a popup element to indicate that voice is being heard
    const popup = document.createElement('div');
    popup.id = 'voicePopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.color = '#fff';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    // for `listening` popup
    if (listening) {
        popup.textContent = 'Listening...';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    } else { // for error popup
        popup.textContent = 'No Voice Recognized!';
        popup.style.backgroundColor = 'red';
    }

    document.body.appendChild(popup);

    return popup;
}


/**
 * This function handles the microphone button click event.
 * call microphoneUI function to create the popup
 * Start the speech recognition
 * After the speech recognition, remove the popup
 * Change the action button icon
 */
function microphoneBtnClicked() {

    // create the popup
    const popup = microphoneUI();

    // Start the speech recognition 
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false; // Only return final results

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        // Set the result to the prompt input
        promptBox.value = transcript;

        // Remove the popup
        if (popup) {
            document.body.removeChild(popup);
        }

        // Change the microphone icon to the send button
        actionBtn.children[0].classList.replace('fa-microphone', 'fa-paper-plane');
    };


    // if error is generated when no voice is recognized, instead of throwing an error we display a popup stating that `no voice recognized!`
    recognition.onerror = () => {
        // Remove the listening popup to create the new error popup
        if (popup && document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
    
        // Create error popup
        const errorPopup = microphoneUI(false);
    
        // Store the click event listener in a variable so it can be removed later
        const clickListener = () => {
            if (errorPopup && document.body.contains(errorPopup)) {
                document.body.removeChild(errorPopup);
            }
            document.body.removeEventListener('click', clickListener); // Correctly remove the event listener
        };
    
        // Add the click event listener to remove the error popup when the user clicks anywhere
        document.body.addEventListener('click', clickListener);
    
        // Automatically remove the popup in 2 seconds
        setTimeout(() => {
            // Ensure the popup still exists before removing it
            if (errorPopup && document.body.contains(errorPopup)) {
                document.body.removeChild(errorPopup); // Remove the error popup after 2 seconds
            }
    
            document.body.removeEventListener('click', clickListener); // Ensure to remove the click event if the timeout expires first
        }, 2000);
    };

    recognition.start();
}


/**
 * This function handles the send button click event.
 * The function is made async as response is being generated inside it, which uses await
 * 1. Gets the value (user entered data) from the prompt box
 * 2. Clears the prompt box & change the action button icon
 * 3. Add the user prompt to the chatbot UI
 * 4. Display AI is thinking message until response gets generated
 * 5. Add a small timer to make sure that the AI is thinking message is displayed, as sometimes the response generated was so quick that AI is thinking message doesn't even get displayed until the response generation. So it might break the code and lead to unexpected output.
 * 6. Modify the prompt to get answers on the point. Refer to promptInputModifier.js file
 * 7. Generate the AI response. Refer to chatbot/chatbotModel.js file
 * 8. Once the response is generated delete the `AI is thinking...` message.
 * 9. Add an empty message to UI (bot side) to display the typing effect.
 * 10. Type the generated response. 
 */
async function sendBtnClicked() {

    let promptValue = getPromptValue();

    // to make sure the prompt is not empty
    if (promptValue) {

        clearPromptInput();
        actionBtn.children[0].classList.replace('fa-paper-plane', 'fa-microphone');

        // 2nd arg is for param `isUser`, 3rd arg is for param `blur`
        chatbotUI.addMessageToUI(promptValue, true, false);

        // to add 'AI is thinking' message for the time,
        // when AI response is being generated
        // the arg is for param `deleteMessage`, currently we don't want to delete,
        // but instead add this message, so "false"
        chatbotUI.beforeResponseGeneration(false);

        // quick timer. (refer to jsdoc of this function for reasons)
        await new Promise(resolve => setTimeout(resolve, 500));

        // to add suffixes to prompt,
        // needed to make sure that AI-model gives on the point answer
        promptValue = modifyPrompt(promptValue);

        const generatedResponse = await generateResponse(promptValue)

        // to delete the message, as response is generated
        chatbotUI.beforeResponseGeneration(true);

        // add empty message as default, as we show a typing effect to add message
        // return responseDiv to display the message with typing effect
        const responseDiv = chatbotUI.addMessageToUI('', false, false);
        await chatbotUI.typeMessage(generatedResponse, responseDiv);
    }
}

/**
 * Gets the prompt value from the prompt input box
 * @returns {string} The trimmed prompt value
 */
const getPromptValue = () => promptBox.value.trim();


/**
 * Clears the prompt Input box
 * Generally, after send button is clicked and current prompt is used.
 */
const clearPromptInput = () => {
    promptBox.value = '';
}
