
/*
    This script is responsible to modify the input prompt provided by user.
    It is important to modify the prompt, to get response as required.
    It generally suffixes the prompt with statements like,
    "Give a short, concise answer".
    This makes sure that the AI model doesn't,
    generate too large non-required responses
 */

/**
 * Responsible to modify prompt, before sending to AI model.
 * To get better results
 * @param {string} promptValue Prompt provided by the user
 * @returns {string} modified prompt
 */
export function modifyPrompt(promptValue) {

    return `Provide a medium-size, concise answer to: ${promptValue}. `;

}
