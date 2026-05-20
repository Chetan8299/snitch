import {Router} from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addToCartValidator } from "../validators/cart.validator.js";
import { addToCart, getCart, incrementCartItemQuantity } from "../controllers/cart.controller.js";

const cartRouter = Router();

/**
 * @route POST /api/cart/:productId/:variantId
 * @description Add a product to the cart
 * @access Private (User)
 * @arguments productId: string, variantId: string
 * @arguments variantId: string
 * @body quantity: number
 */
cartRouter.post("/add/:productId/:variantId", authenticateUser, ...addToCartValidator, addToCart)

/**
 * @route GET /api/cart
 * @description Get the cart for the current user
 * @access Private (User)
 */
cartRouter.get("/", authenticateUser, getCart)

/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @description Increment item quantity in the cart by one
 * @access Private (User)
 * @arguments productId: string, variantId: string
 */
cartRouter.patch("/quantity/increment/:productId/:variantId", authenticateUser, incrementCartItemQuantity)

export default cartRouter;