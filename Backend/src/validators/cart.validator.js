import { validate } from "./product.validator.js";
import { param, body } from "express-validator";


export const addToCartValidator = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").isMongoId().withMessage("Invalid variant ID"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validate
]