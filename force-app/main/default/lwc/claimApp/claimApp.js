import { track } from "lwc";
import ClaimBase from "c/claimBase";
import ToastContainer from "lightning/toastContainer";

/**
 * Extends ClaimBase to provide UI logic for handling the creation of claim records.
 * It manages the visibility of claim options and claim process sections.
 *
 */
export default class ClaimApp extends ClaimBase {
    @track showClaimOptions = true; // Tracks the visibility of the claim options section.
    @track showClaimProcess = false; // Tracks the visibility of the claim process section.
    @track claimSubmitted = false;
    @track myClaims = [];
    claimer;

    columns = [
        {
            label: "Claimer",
            fieldName: "claimer",
            type: "text",
            initialWidth: 200
        },
        {
            label: "Status",
            fieldName: "status",
            type: "text",
            initialWidth: 200
        },
        {
            label: "Provider",
            fieldName: "provider",
            type: "text",
            initialWidth: 300
        },
        {
            label: "Proof of Expenses",
            fieldName: "attachments",
            type: "text",
            initialWidth: 400,
            wrapText: true
        },
        {
            label: "Treatment Details",
            fieldName: "treatmentItems",
            type: "text",
            wrapText: true
        }
    ];

    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.maxShown = 5;
        toastContainer.toastPosition = "top-right";
    }

    /**
     * Handles the claim making process. It hides the claim options UI, shows the claim process UI
     * @param {Event} event - The event containing the claimer details.
     */
    handleMakeClaim(event) {
        this.showClaimOptions = false;
        this.claimer = event.detail.claimer;
        this.showClaimProcess = true;
    }

    /**
     * Resets the UI to show the claim options and hide the claim process section,
     * effectively canceling the current process.
     */
    handleCancelProcess() {
        this.showClaimOptions = true;
        this.showClaimProcess = false;
    }

    get claims() {
        if (!this.myClaims || this.myClaims.length === 0) return false;
        return this.myClaims;
    }

    /**
     * Create a claim object after user submits claim, adds it to the list of claims
     * and show a list of claims in the UI.
     * @param {Event} event - The event containing details about the claim being submitted, such as
     * provider, status, attachments, and treatment details.
     */
    handleSubmitClaim(event) {
        let currentClaim = {
            claimer: this.claimer,
            provider: event.detail.provider,
            status: event.detail.status,
            attachments: event.detail.attachments.map((att) => att.filename).join("\n"),
            treatmentItems: event.detail.treatmentItems
                .map(
                    (item) =>
                        `${item.itemName} for ${item.treatmentFor} administered on ${item.formattedDate} with a cost of $` +
                        item.treatmentCost.toString()
                )
                .join("\n")
        };
        this.myClaims = [...this.myClaims, currentClaim];
        this.showClaimProcess = false;
        this.claimSubmitted = true;
    }

    handleReset() {
        this.claimSubmitted = false;
        this.showClaimOptions = true;
    }
}
