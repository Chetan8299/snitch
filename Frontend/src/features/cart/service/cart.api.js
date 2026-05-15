import axios from "axios"

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export async function addItem(productId, variantId, quantity) {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, { quantity })

    return response.data;
}

export async function getCart() {
    const response = await cartApiInstance.get("/")
    return response.data;
}