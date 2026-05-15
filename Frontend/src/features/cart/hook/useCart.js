import { addItem, getCart } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart, setItems } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem(productId, variantId, quantity) {
        console.log(productId, variantId, quantity)
        const data = await addItem(productId, variantId, quantity)
        console.log(data)
        dispatch(addItemToCart(data.item ?? data))
    }

    async function handleGetCart() {
        const data = await getCart();
        dispatch(setItems(data.cart.items)) 
    }


    return { handleAddItem, handleGetCart }
}

export default useCart;