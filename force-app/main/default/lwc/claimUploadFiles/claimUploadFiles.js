import { track, api } from "lwc";
import ClaimBase from "c/claimBase";

/**
 * Handle the upload and management of file attachments within a claim processing application
 */
export default class ClaimUploadFiles extends ClaimBase {
    @api initialAttachments = [];
    @track attachments = [];

    connectedCallback() {
        this.attachments = this.initialAttachments ?? [];
    }

    // Method to handle file uploads
    openfileUpload(event) {
        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            let base64 = reader.result.split(",")[1];
            let fileData = {
                filename: file.name,
                base64Content: base64
            };
            this.attachments = [...this.attachments, fileData];
            this.dispatchToParent("uploadfile", this.attachments);
        };
        reader.readAsDataURL(file);
    }

    // Method to delete a specific file attachment after user clicks Delete icon
    deleteFile(event) {
        const index = parseInt(event.target.dataset.index, 10);
        this.attachments = this.attachments.filter((_, i) => i !== index); //Filter out the deleted file and return updated array
        this.dispatchToParent("uploadfile", this.attachments); // Dispatch updated files to parent components
    }
}
