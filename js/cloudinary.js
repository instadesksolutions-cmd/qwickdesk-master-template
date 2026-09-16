/* ==========================================================================
   QwickDesk Solutions - Cloudinary Image Upload Utility
   Yeh file browser se direct HD images ko Cloudinary par securely upload karegi.
   ========================================================================== */

// Tera Cloudinary Cloud Name aur Unsigned Upload Preset
const CLOUD_NAME = "srfb0hl0";
const UPLOAD_PRESET = "qwickdesk_demo"; // Jo preset humne Cloudinary dashboard par banaya tha

/**
 * UPLOAD IMAGE FUNCTION (Client-Side)
 * @param {File} imageFile - HTML File input se mili hui image file object
 * @returns {string|null} - Upload hone ke baad Cloudinary ka secure image URL
 */
export async function uploadImageToCloudinary(imageFile) {
    if (!imageFile) {
        console.warn("⚠️ No image file provided for upload.");
        return null;
    }

    // FormData object create kar rahe hain jo Cloudinary API ko chahiye
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        console.log("☁️ Uploading image to Cloudinary...");

        // Fetch API ka use karke direct Cloudinary server par post request bhej rahe hain
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Image Upload Successful! URL: ", data.secure_url);
            return data.secure_url; // Yeh URL hum Firestore database mein save karenge
        } else {
            throw new Error(data.error.message || "Failed to upload image to Cloudinary.");
        }

    } catch (error) {
        console.error("❌ Cloudinary Upload Error: ", error);
        alert("Image upload failed: " + error.message);
        return null;
    }
}
