/**
 * Create a new modal dynamically
 */
export function createModal(title, content) {
    const overlay = createOverlay();
    const modal = createModalElement(title, content);
    document.body.append(overlay, modal);
    return modal;
}
/**
 * Create the overlay element
 */
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "rubicks-modal-overlay";
    return overlay;
}
/**
 * Create the modal element
 */
function createModalElement(title, content) {
    const modal = document.createElement("div");
    modal.className = "rubicks-modal";
    const header = document.createElement("h2");
    header.textContent = title;
    const body = document.createElement("div");
    body.className = "rubicks-modal-body";
    body.innerHTML = content;
    modal.append(header, body);
    return modal;
}
/**
 * Show a modal
 */
export function showModal(modal) {
    const modalElement = resolveModalElement(modal);
    if (!modalElement)
        return;
    activateModal(modalElement);
    ensureOverlayExists();
    setupCloseButton(modalElement);
    trapFocus(modalElement);
    setupEscapeKey(modalElement);
}
/**
 * Resolve the modal element from HTMLElement or ID
 */
function resolveModalElement(modal) {
    return typeof modal === "string" ? document.getElementById(modal) : modal;
}
/**
 * Activate the modal for display
 */
function activateModal(modal) {
    modal.style.display = "block";
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-active");
}
/**
 * Ensure the modal overlay exists
 */
function ensureOverlayExists() {
    if (!document.querySelector(".rubicks-modal-overlay")) {
        document.body.appendChild(createOverlay());
    }
}
/**
 * Close a modal
 */
export function closeModal(modal) {
    const modalElement = resolveModalElement(modal);
    if (!modalElement)
        return;
    deactivateModal(modalElement);
    removeOverlay();
}
/**
 * Deactivate the modal and handle cleanup
 */
function deactivateModal(modal) {
    if (modal.dataset.predefined === "true") {
        modal.style.display = "none"; // Hide predefined modals
    }
    else {
        modal.remove(); // Remove dynamically created modals
    }
    document.body.classList.remove("modal-active");
}
/**
 * Remove the modal overlay
 */
function removeOverlay() {
    const overlay = document.querySelector(".rubicks-modal-overlay");
    overlay?.remove();
}
/**
 * Trap focus within the modal
 */
export function trapFocus(modal) {
    const focusableElements = getFocusableElements(modal);
    const [firstElement, lastElement] = [
        focusableElements[0],
        focusableElements[focusableElements.length - 1],
    ];
    const handleFocus = (event) => {
        if (event.key !== "Tab")
            return;
        handleTabKey(event, firstElement, lastElement);
    };
    setupFocusListeners(modal, focusableElements, handleFocus);
}
/**
 * Get focusable elements within a modal
 */
function getFocusableElements(modal) {
    return modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
}
/**
 * Handle Tab key navigation
 */
function handleTabKey(event, firstElement, lastElement) {
    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
    }
    else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
    }
}
/**
 * Setup focus listeners for the modal
 */
function setupFocusListeners(modal, focusableElements, handleFocus) {
    modal.addEventListener("keydown", handleFocus);
    if (focusableElements.length === 0) {
        modal.tabIndex = -1;
        modal.focus();
    }
    else {
        focusableElements[0]?.focus();
    }
    modal.addEventListener("close", () => {
        modal.removeEventListener("keydown", handleFocus);
    });
}
/**
 * Ensure a close button is present in the modal
 */
function setupCloseButton(modal) {
    let closeButton = modal.querySelector(".close-button");
    if (!closeButton) {
        closeButton = createCloseButton(modal);
        modal.prepend(closeButton);
    }
}
/**
 * Create a close button for the modal
 */
function createCloseButton(modal) {
    const button = document.createElement("button");
    button.innerHTML = "&times;";
    button.className = "close-button";
    button.addEventListener("click", () => closeModal(modal));
    return button;
}
/**
 * Add Escape key listener to close the modal
 */
function setupEscapeKey(modal) {
    const handleEscape = (event) => {
        if (event.key === "Escape") {
            closeModal(modal);
            document.removeEventListener("keydown", handleEscape);
        }
    };
    document.addEventListener("keydown", handleEscape);
    modal.dataset.escapeListener = handleEscape.toString();
}
/**
 * Remove Escape key listener
 */
function removeEscapeKey(modal) {
    const handleEscape = modal.dataset.escapeListener;
    if (handleEscape) {
        document.removeEventListener("keydown", eval(handleEscape));
        delete modal.dataset.escapeListener;
    }
}
