import ClaimBase from "c/claimBase";

export default class ClaimPayment extends ClaimBase {
    paymentDetails = {
        bank: "Commonwealth Bank of Australia",
        bsb: "000000",
        accountNum: "0123456"
    };

    // Disptach payment details to parent component (claimProcess)
    connectedCallback() {
        this.dispatchToParent("sendpaymentdetails", this.paymentDetails);
    }
}
