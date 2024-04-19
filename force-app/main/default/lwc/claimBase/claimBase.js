import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

/**
 * Base class for components that need to communicate with their parent component
 * and display toast messages.
 */
export default class ClaimBase extends LightningElement {
    /**
     * Dispatches a custom event to the parent component.
     * @param {string} eventName - The name of the event to dispatch.
     * @param {Object} detail - The detail object containing event-specific data.
     */
    dispatchToParent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        this.dispatchEvent(event);
    }

    /**
     * Shows an error message in a toast notification.
     * @param {string} msg - The message to be displayed in the toast.
     */
    showError(msg) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Error",
                message: msg,
                variant: "error"
            })
        );
    }

    /**
     * Shows a success message in a toast notification.
     * @param {string} msg - The message to be displayed in the toast.
     */
    showMessage(msg) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Success",
                message: msg,
                variant: "success"
            })
        );
    }
}
