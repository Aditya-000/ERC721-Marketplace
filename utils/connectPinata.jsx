import axios from "axios";

const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

/**
 * Upload file (image/video) to Pinata
 */
export const uploadFileToPinata = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (err) {
    console.error("File upload error:", err);
    throw err;
  }
};

/**
 * Upload JSON metadata to Pinata
 */
export const uploadJSONToPinata = async (jsonData) => {
  try {
    const res = await axios.post(`${PINATA_BASE_URL}/pinJSONToIPFS`, jsonData, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (err) {
    console.error("JSON upload error:", err);
    throw err;
  }
};


