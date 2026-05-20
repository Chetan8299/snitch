import { addItem, getCart, incrementCartItemQuantity } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart, setCart, incrementCartItem } from "../state/cart.slice"

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
        dispatch(setCart(data.cart))
    }

    async function handleIncrementCartItemQuantity(productId, variantId) {
        await incrementCartItemQuantity(productId, variantId)
        dispatch(incrementCartItem(productId, variantId))
    }


    return { handleAddItem, handleGetCart, handleIncrementCartItemQuantity }
}

export default useCart;