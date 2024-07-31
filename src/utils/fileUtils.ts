import cryptoUtil from "crypto";

export const ALLOWED_IMAGE_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/avif",
];
export const ALLOWED_VIDEO_FILE_TYPES = ["video/mp4", "video/x-matroska"];

export const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
};

export function getImageData(file: File) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();

    if (!file) return { displayUrl: "" };
    // Add newly uploaded image
    dataTransfer.items.add(file);

    const displayUrl = URL.createObjectURL(file);

    return { displayUrl };
}

export const generateUniqueFileName = (bytes = 32) =>
    cryptoUtil.randomBytes(bytes).toString("hex");
