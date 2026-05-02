import { Router } from "express"
import { authenticateSeller } from "../middlewares/auth.middleware.js"
import { createProduct, getProductsForSeller } from "../controllers/product.controller.js";
import { uploadProductImages } from "../middlewares/upload.js"
import { createProductValidator } from "../validators/product.validator.js";

const productRouter = Router();


/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller)
 */
productRouter.post(
    "/",
    authenticateSeller,
    uploadProductImages,
    ...createProductValidator,
    createProduct
)

/**
 * @route GET /api/products/seller
 * @description Get all products for a seller
 * @access Private (Seller)
 */
productRouter.get("/seller", authenticateSeller, getProductsForSeller)

export default productRouter;