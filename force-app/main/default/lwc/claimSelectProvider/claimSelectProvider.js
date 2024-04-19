import { track, api } from "lwc";
import ClaimBase from "c/claimBase";

/**
 * Component for selecting a provider from a predefined list within the claim process.
 * Inherits from ClaimBase to utilize shared functionalities such as event dispatching
 * and message handling. It allows users to select a provider and notify the
 * selection to the parent component (claimProcess).
 */
export default class ClaimSelectProvider extends ClaimBase {
    @api provider; // The currently selected provider.

    // Predefined list of providers available for selection.
    @track providers = [
        {
            label: "J HARVEY - ABC DENTAL",
            value: "J HARVEY - ABC DENTAL"
        },
        {
            label: "L GROGAN - HAPPY SMILE DENTAL",
            value: "L GROGAN - HAPPY SMILE DENTAL"
        },
        {
            label: "R GALLOWAY - KIDS DENTAL",
            value: "R GALLOWAY - KIDS DENTAL"
        }
    ];

    /**
     * Handle the event triggered upon changing the selected provider
     * and dispatches the selection to the parent component.
     * @param {Event} event - The event containing details of the selected provider.
     */
    handleProviderChange(event) {
        let selectedProvider = event.detail.value;
        this.dispatchToParent("selectprovider", selectedProvider);
    }
}
