import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { createProduct, getAllProducts, getProductDetails, getProductsForSeller } from "../services/product.api";
import { setProducts, setSellerProducts } from "../state/product.slice";

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

    const handleGetAllProducts = useCallback(async () => {
        const data = await getAllProducts();
        dispatch(setProducts(data.products ?? []));
        return data.products ?? [];
    }, [dispatch]);

    const handleGetProductDetails = useCallback(async (id) => {
        const data = await getProductDetails(id);
        return data.product;
    }, []);

    return {
        handleCreateProduct,
        handleGetProductsForSeller,
        handleGetAllProducts,
        handleGetProductDetails,
    };
};