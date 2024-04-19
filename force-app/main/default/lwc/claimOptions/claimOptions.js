import { track, api } from "lwc";
import ClaimBase from "c/claimBase";

/**
 * Provides UI components for selecting a claimer.
 * It extends ClaimBase to leverage common functionalities like error handling and event dispatching.
 */
export default class ClaimOptions extends ClaimBase {
    @track selectedClaimer = ""; // Tracks the selected claimer's name.
    @api claimId; // Exposed property to hold the claim Id, settable by the parent component.

    // Predefined list of claimers for selection.
    claimers = [
        { label: "John Doe", value: "John Doe" },
        { label: "Jane Doe", value: "Jane Doe" }
    ];

    /**
     * Handles changes to the claimer selection, updating the selectedClaimer property.
     * @param {Event} event - The event object containing the selected claimer's value.
     */
    handleOptionChange(event) {
        this.selectedClaimer = event.detail.value;
    }

    /**
     * Dispatch the selected claimer to the parent component (claimApp).
     * If no claimer is selected, displays an error message.
     */
    handleMakeClaim() {
        if (!this.selectedClaimer) {
            this.showError("Please select a claimer");
            return;
        }
        this.dispatchToParent("makeclaim", { claimer: this.selectedClaimer });
    }

    /**
     * Placeholder for logic to get an estimate of the claim.
     */
    handleGetEstimate() {
        // TODO: Implement logic to get an estimate.
    }

    /**
     * Placeholder for logic to view previous estimates.
     */
    handleViewPrevious() {
        // TODO: Implement logic to view previous estimates.
    }

    /**
     * Placeholder for logic to change claim payment details.
     */
    handleChangePaymentDetails() {
        // TODO: Implement logic to change claim payment details.
    }
}
