import { track, api } from "lwc";
import ClaimBase from "c/claimBase";

/**
 * Component responsible for managing the claim processing steps. It extends the ClaimBase
 * to utilize shared functionalities such as message display and event dispatching. This
 * component allows for navigation between different steps of the claim process, handling
 * user inputs, and submitting the claim.
 */
export default class ClaimProcess extends ClaimBase {
    @track currentStep = "1"; // The current step in the claim process.
    @track claim = {
        status: "Draft",
        contactEmail: "claimer@gmail.com",
        attachments: [],
        treatmentItems: []
    };

    TOTAL_STEPS = 5; // The total number of steps in the claim process.

    // Getters to facilitate UI logic, determining the current step and enabling/disabling UI components accordingly.
    get isStepOne() {
        return this.currentStep === "1";
    }
    get isStepTwo() {
        return this.currentStep === "2";
    }
    get isStepThree() {
        return this.currentStep === "3";
    }
    get isStepFour() {
        return this.currentStep === "4";
    }
    get isStepFive() {
        return this.currentStep === "5";
    }
    get isFirstStep() {
        return this.currentStep === "1";
    }
    get isLastStep() {
        return this.currentStep === "5";
    }
    get isNotLastStep() {
        return this.currentStep !== "5";
    }
    // Calculate total cost of the claim
    get totalCost() {
        let totalCost = 0;
        this.claim.treatmentItems.forEach((item) => {
            totalCost += item.treatmentCost ?? 0;
        });
        return totalCost;
    }

    /**
     * Notifies the parent component (claimApp) to cancel the claim process.
     */
    handleCancel() {
        this.dispatchEvent(new CustomEvent("cancel"));
    }

    /**
     * Navigates to the previous step in the claim process.
     */
    handlePrevious() {
        let currentStepNumber = parseInt(this.currentStep, 10);
        currentStepNumber--;
        this.currentStep = currentStepNumber.toString();
    }

    /**
     * Advances to the next step in the claim process, performing necessary validations and state updates.
     */
    handleNext() {
        // Validate to make sure at least one file is submitted or a provider is selected.
        if (this.isStepOne && this.claim.attachments.length < 1) {
            this.showError("Please upload proof of expenses");
            return;
        } else if (this.isStepTwo && !this.claim.provider) {
            this.showError("Please select a provider");
            return;
        }

        // Get the number part of the current step (e.g., "1" -> 1).
        const currentStepNumber = parseInt(this.currentStep, 10);

        // Check if the current step is not the last one.
        if (currentStepNumber > 0 && currentStepNumber < this.TOTAL_STEPS) {
            // Increment the step number to get the next step.
            const nextStepNumber = currentStepNumber + 1;
            this.currentStep = nextStepNumber.toString();
        }
        // format Treatment Date to show in the UI
        if (this.isLastStep) {
            if (this.claim.treatmentItems && this.claim.treatmentItems.length > 0) {
                this.claim.treatmentItems.forEach((item) => {
                    item.formattedDate = item.treatmentDate.toLocaleDateString();
                    return item;
                });
            }
        }
    }

    /**
     * Submits the claim data for update, displaying success or error messages.
     */
    handleSubmit() {
        this.claim.status = "Submitted";
        this.dispatchToParent("submitclaim", this.claim);
    }

    /**
     * Adds a file name to the list of uploaded files upon file upload.
     * @param {Event} event - The event containing details of the uploaded file.
     */
    handleUploadFile(event) {
        this.claim.attachments = event.detail;
    }

    /**
     * Saves treatment items from an event payload into the component's state.
     * @param {Event} event - The event containing treatment item details.
     */
    handleSaveTreatmentItem(event) {
        this.claim.treatmentItems = event.detail;
    }

    /**
     * Updates the selected provider based on user selection.
     * @param {Event} event - The event containing the selected provider.
     */
    handleSelectProvider(event) {
        this.claim.provider = event.detail;
    }

    /**
     * Updates payment details based on user input.
     * @param {Event} event - The event containing the payment details.
     */
    handleSendPaymentDatails(event) {
        this.claim.paymentDetails = event.detail;
    }
}
