import { track, api } from "lwc";
import ClaimBase from "c/claimBase";

/**
 * Component for managing treatment details and dispatching them to parent component (claimProcess).
 * It allows for the addition, display, and deletion of treatment items, and calculates
 * the total cost of all treatments. This component extends ClaimBase to inherit
 * common functionalities such as message handling and event dispatching.
 */
export default class ClaimTreatmentDetails extends ClaimBase {
    @api initialItems = []; // Initial set of treatment items, if any.
    @track treatmentItems = []; // Tracks treatment items for reactivity.
    @api claimId; // The ID of the claim being processed.
    showModalPopup = false; // Controls the visibility of the modal popup for adding a new treatment item.

    // Options for dropdown selections in the form.
    personOptions = [
        { label: "John Doe", value: "John Doe" },
        { label: "Jane Doe", value: "Jane Doe" }
    ];

    treatmentOptions = [
        {
            label: "00011 - Comprehensive Oral Examination",
            value: "00011 - Comprehensive Oral Examination"
        },
        {
            label: "00012 - Periodic Oral Examination",
            value: "00012 - Periodic Oral Examination"
        },
        { label: "00014 - Consultation", value: "00014 - Consultation" }
    ];

    // Columns configuration for the treatment items display table.
    columns = [
        { label: "Item #", fieldName: "itemNumber", type: "number" },
        { label: "Item Name", fieldName: "itemName", type: "text" },
        { label: "Treatment for", fieldName: "treatmentFor", type: "text" },
        { label: "Treatment Date", fieldName: "treatmentDate", type: "date" },
        { label: "Cost", fieldName: "treatmentCost", type: "currency" },
        {
            label: "Action",
            type: "button",
            typeAttributes: {
                label: "Delete",
                name: "Delete",
                title: "Delete",
                value: "delete"
            },
            cellAttributes: { class: { fieldName: "cellClass" } }
        }
    ];

    /**
     * Calculate the total cost of all treatment items.
     */
    get totalCost() {
        let totalCost = 0;
        if (this.treatmentItems) {
            this.treatmentItems.forEach((item) => {
                totalCost += item.treatmentCost;
            });
        }
        return totalCost;
    }

    // Temporary storage for input data from the add item form.
    @track tempItem = {
        itemNumber: "",
        itemName: "",
        treatmentFor: "",
        date: "",
        cost: ""
    };

    /**
     * Lifecycle hook that runs when the component is inserted into the DOM.
     * Initializes the treatmentItems array with initialItems.
     */
    connectedCallback() {
        this.treatmentItems = this.initialItems ?? [];
    }

    /**
     * Shows the modal popup for adding a new treatment item.
     */
    handleAddItem() {
        this.showModalPopup = true;
    }

    /**
     * Closes the modal popup without saving the treatment item.
     */
    handleClosePopup() {
        this.showModalPopup = false;
    }

    /**
     * Saves the new treatment item from the modal popup to the treatmentItems array,
     * dispatches an event to the parent component, and closes the popup.
     */
    handleSaveItem() {
        if (
            !this.tempItem.itemName ||
            !this.tempItem.treatmentFor ||
            !this.tempItem.treatmentDate ||
            !this.tempItem.treatmentCost
        ) {
            this.showError("Please fill the required fields");
            return;
        }
        let newItem = {
            itemName: this.tempItem.itemName,
            treatmentFor: this.tempItem.treatmentFor,
            treatmentDate: new Date(this.tempItem.treatmentDate),
            treatmentCost: parseFloat(this.tempItem.treatmentCost),
            itemNumber: this.treatmentItems.length + 1
        };
        this.treatmentItems = [...this.treatmentItems, newItem];
        this.showModalPopup = false;
        this.resetTempItem();

        this.dispatchToParent("savetreatmentitem", this.treatmentItems);
    }

    /**
     * Resets the temporary item form data to empty values.
     */
    resetTempItem() {
        this.tempItem = {
            itemNumber: "",
            itemName: "",
            treatmentFor: "",
            treatmentDate: "",
            treatmentCost: ""
        };
    }

    /**
     * Remove deleted treatment items and dispatch the updated treatment items to parent component.
     * @param {Event} event - The event containing details of the action and associated row data.
     */
    handleRowAction(event) {
        try {
            let recordIndex = this.treatmentItems.findIndex(
                (record) => record.itemNumber === event.detail.row.itemNumber
            );
            this.treatmentItems.splice(recordIndex, 1); //Remove deleted treatment item
            this.treatmentItems = [...this.treatmentItems];
            this.dispatchToParent("savetreatmentitem", this.treatmentItems);
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Handlers for changes in input fields update the temporary item.
    handleItemNumberChange(event) {
        this.tempItem.itemNumber = event.target.value;
    }

    handleItemNameChange(event) {
        this.tempItem.itemName = event.target.value;
    }

    handleTreatmentForChange(event) {
        this.tempItem.treatmentFor = event.target.value;
    }

    handleDateChange(event) {
        this.tempItem.treatmentDate = event.target.value;
    }

    handleCostChange(event) {
        this.tempItem.treatmentCost = event.target.value;
    }
}
