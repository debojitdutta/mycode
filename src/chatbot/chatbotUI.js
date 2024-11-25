
/*
    This script handles all the tasks related to the interface of the ChatBot,
    Mainly adding the messages to the ChatUI,
    Whether it is the prompt from the user or the AI response.
 */


/**
 * the container for all the chats,
 * any new generated chat will be added as a div element in this
 * @const
 * @type {HTMLElement}
 */
const currentChat = document.getElementById('chatMessages');

/**
 * Responsible to add user & bot messages to the UI
 *
 * @param {string} message The content to add
 * @param {boolean} isUser to find out whether to add a
 * user message or a bot message [false for user, true for bot]
 * User message appears on the right, bot message on the left
 * @param {boolean} blur to blur out the message in the UI,
 * generally used to display the message such as `AI is thinking...`
 */
export function addMessageToUI(message, isUser = false, blur = false) {

    // create the parent div that will be added to the current chat,
    // it will have the avatar and the message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(
        'message', isUser ? 'user-message' : 'bot-message'
    );

    // message
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = message;

    // whether to blur out the message or not
    if(blur) {
        contentDiv.classList.add('blur');
    }

    // avatar
    const avatarImg = document.createElement('img');
    avatarImg.classList.add('avatar', isUser ? 'user-image' : 'bot-image');
    avatarImg.src = isUser
        ? 'default/images/profile-image.png'
        : 'default/images/logo.png';

    // add the element to the UI
    messageDiv.appendChild(avatarImg);
    messageDiv.appendChild(contentDiv);
    currentChat.appendChild(messageDiv);

    // if it's an AI response, and it's not blurred,
    // means it is the generated response
    // so we return the contentDiv, where the message will appear
    // to add the typing effect when displaying the response
    if(!isUser && !blur) {
        return contentDiv;
    }
}


/**
 * To display messages such as `AI is thinking`,
 * before the actual response gets displayed.
 * It is also responsible to delete the `AI is thinking...`
 * message once the response is generated
 *
 * @param {boolean} deleteMessage true when the message is to be deleted,
 * else false to add the message. (Defaults to false)
 *
 * @returns {Promise} resolves when the message is successfully added/deleted.
 * This is important as we add a small-time before adding `AI is thinking...`,
 * message and sometimes the response gets generated before this message can be
 * displayed. That might break the code. So we make sure that AI starts generating response once this is resolved.
 */
export function beforeResponseGeneration(deleteMessage = false) {
    return new Promise(resolve => {

        if(deleteMessage) {

            const currentChat = document.getElementById('chatMessages');

            // currentChat gives the whole list of conversation,
            // lastElementChild of it is the div,
            // that has the message along with the avatar, so we take the
            // lastElementChild of it to get the div,
            // with the actual message `AI is thinking...`
            const messageToDelete = currentChat
                .lastElementChild.lastElementChild;

            // just a check to make sure we don't try to remove a non-existing element
            if(messageToDelete.classList.contains('blur')) {
                currentChat.removeChild(messageToDelete.parentElement);
            }

            resolve();

        } else {
            function showMessage() {
                addMessageToUI('AI is thinking...', false, true);
                resolve();
            }

            // add message after 500m/s
            setTimeout(showMessage, 500);
        }
    });
}

/**
 * Display the AI response with a typing effect.
 * @param {string} message - The message to be displayed
 * @param {HTMLElement} contentDiv - The content div where the message will appear
 * @returns {Promise} - resolves when the message is fully typed
 */
export function typeMessage(message, contentDiv) {
    return new Promise((resolve) => {
        let index = 0;

        function typeChar() {
            if (index < message.length) {
                contentDiv.textContent += message.charAt(index);
                index++;
                setTimeout(typeChar, 5); // 5ms per char
            } else {
                resolve(); // Resolve when message is completely typed
            }
        }

        typeChar(); // Start typing
    });
}

