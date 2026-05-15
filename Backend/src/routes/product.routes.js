import { Router } from "express"
import { authenticateSeller } from "../middlewares/auth.middleware.js"
import { createProduct, getProducts, getProductsForSeller, getProductDetails, createProductVariant } from "../controllers/product.controller.js";
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

/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
productRouter.get('/', getProducts);

/**
 * @route GET /api/products/:id
 * @description Get a product by id
 * @access Public
 */
productRouter.get('/:productId', getProductDetails);

/**
 * @route POST /api/products/:productId/variants
 * @description Create a new variant for a product
 * @access Private (Seller)
 */
productRouter.post("/:productId/variants", authenticateSeller, uploadProductImages, createProductVariant)

export default productRouter;