import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartId: null,
        totalPrice: 0,
        currency: "INR",
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            const raw = action.payload;
            const cart = Array.isArray(raw) ? (raw[0] ?? null) : raw;
            state.cartId = cart?._id ?? null;
            state.totalPrice = Number(cart?.totalPrice) || 0;
            state.currency = cart?.currency || "INR";
            state.items = Array.isArray(cart?.items) ? cart.items : [];
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.map(item => {
                if (item._id === productId && item.variant._id === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                return item;
            })
        }
    }
})

export const { setCart, setItems, addItem, removeItem, incrementCartItem } = cartSlice.actions;

export default cartSlice.reducer;