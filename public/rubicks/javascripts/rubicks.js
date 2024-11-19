import { createModal, showModal, closeModal, trapFocus } from './utils.js';
class Rubicks {
    /**
     * Create a modal and append button container
     */
    static createModalWithButtons(options) {
        const modal = createModal(options.title, options.content || options.message || "");
        const buttonContainer = this.createButtonContainer(options, modal);
        modal.appendChild(buttonContainer);
        return modal;
    }
    /**
     * Create button container with OK and Cancel buttons
     */
    static createButtonContainer(options, modal) {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("rubicks-modal-buttons");
        if (options.buttons) {
            options.buttons.forEach(button => buttonContainer.appendChild(button));
        }
        else {
            this.addDefaultButtons(buttonContainer, options, modal);
        }
        return buttonContainer;
    }
    /**
     * Add default OK and Cancel buttons
     */
    static addDefaultButtons(container, options, modal) {
        const okButton = this.createButton(options.okText || "Ok", "primary", () => {
            options.callback?.(true);
            closeModal(modal);
        });
        container.appendChild(okButton);
        if (options.cancelText) {
            const cancelButton = this.createButton(options.cancelText, "secondary", () => {
                options.callback?.(false);
                closeModal(modal);
            });
            container.appendChild(cancelButton);
        }
    }
    /**
     * Create a button element with a click handler
     */
    static createButton(text, className, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener("click", onClick);
        return button;
    }
    /**
     * Show a modal with given options
     */
    static baseModal(options) {
        const modal = this.createModalWithButtons(options);
        showModal(modal);
        trapFocus(modal);
    }
    /**
     * Show an alert modal
     */
    static showAlert(options) {
        this.baseModal(options);
    }
    /**
     * Show a confirm modal
     */
    static showConfirm(options) {
        this.baseModal(options);
    }
    /**
     * Show an AJAX modal
     */
    static showAjax(options) {
        const loadingModal = createModal(options.title, "<p>Loading...</p>");
        showModal(loadingModal);
        trapFocus(loadingModal);
        fetch(options.url)
            .then(response => this.handleFetchResponse(response))
            .then(content => this.handleAjaxContent(content, loadingModal, options))
            .catch(error => this.handleAjaxError(error, loadingModal, options));
    }
    /**
     * Handle fetch response
     */
    static handleFetchResponse(response) {
        if (!response.ok) {
            throw new Error("Failed to fetch content.");
        }
        return response.text();
    }
    /**
     * Handle AJAX content and close loading modal
     */
    static handleAjaxContent(content, loadingModal, options) {
        closeModal(loadingModal);
        this.baseModal({ ...options, content });
    }
    /**
     * Handle AJAX error
     */
    static handleAjaxError(error, loadingModal, options) {
        console.error("Error loading AJAX content:", error);
        closeModal(loadingModal);
        this.baseModal({
            ...options,
            message: "<p>Error loading content. Please try again later.</p>",
        });
    }
    /**
     * Show a predefined modal with optional AJAX loading
     */
    static rubicksModal(modalId, options) {
        const modalElement = document.getElementById(modalId);
        if (!modalElement)
            return console.error(`Modal with ID "${modalId}" not found.`);
        this.setupModal(modalElement, options);
        showModal(modalElement);
        trapFocus(modalElement);
    }
    /**
     * Setup modal with optional AJAX content and callbacks
     */
    static setupModal(modalElement, options) {
        if (!modalElement.dataset.predefined)
            modalElement.dataset.predefined = "true";
        const bodyElement = modalElement.querySelector(".rubicks-modal-body");
        if (!bodyElement)
            return console.error("Modal body element not found.");
        if (options?.url)
            this.loadAjaxContentIntoModal(bodyElement, options.url);
        this.setupModalButtons(modalElement, options);
    }
    /**
     * Load AJAX content into modal body
     */
    static loadAjaxContentIntoModal(bodyElement, url) {
        bodyElement.innerHTML = "Loading...";
        fetch(url)
            .then(response => this.handleFetchResponse(response))
            .then(content => (bodyElement.innerHTML = content))
            .catch(error => {
            console.error("Error loading AJAX content:", error);
            bodyElement.innerHTML = "<p>Error loading content.</p>";
        });
    }
    /**
     * Setup modal buttons with callbacks
     */
    static setupModalButtons(modalElement, options) {
        this.replaceButtonHandler(modalElement, ".primary", options?.callback, true);
        this.replaceButtonHandler(modalElement, ".secondary", options?.callback, false);
    }
    /**
     * Replace button handler
     */
    static replaceButtonHandler(modalElement, selector, callback, result) {
        const button = modalElement.querySelector(selector);
        if (button) {
            const newButton = button.cloneNode(true);
            button.replaceWith(newButton);
            if (callback)
                newButton.addEventListener("click", () => {
                    callback(result);
                    closeModal(modalElement);
                });
        }
    }
    /**
     * Close a modal by ID or HTMLElement
     */
    static closeModal(modalId) {
        closeModal(modalId);
    }
}
export default Rubicks;
window.Rubicks = Rubicks;
