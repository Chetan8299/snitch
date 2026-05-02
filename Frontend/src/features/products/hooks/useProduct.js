import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { createProduct, getProductsForSeller } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = useCallback(async (formData) => {
        const data = await createProduct(formData);
        return data.product;
    }, []);

    const handleGetProductsForSeller = useCallback(async () => {
        const data = await getProductsForSeller();
        dispatch(setSellerProducts(data.products ?? []));
        return data.products ?? [];
    }, [dispatch]);

    return {
        handleCreateProduct,
        handleGetProductsForSeller,
    };
};