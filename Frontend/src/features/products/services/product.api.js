import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})

function debugFormData(formData) {
    if (!import.meta.env.DEV) return;
    const rows = [...formData.entries()].map(([key, value]) => ({
        key,
        value: value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value,
    }));
    console.debug("[createProduct] FormData entries", rows);
}

export async function createProduct(formData) {
    debugFormData(formData);
    const response = await productApiInstance.post("/", formData);
    return response.data;
}

export async function getProductsForSeller() {
    const response = await productApiInstance.get("/seller");

    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/");
    return response.data;
}

export async function getProductDetails(id) {
    const response = await productApiInstance.get(`/${id}`);
    return response.data;
}