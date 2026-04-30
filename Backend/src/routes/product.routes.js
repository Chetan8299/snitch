import { Router } from "express"
import { authenticateSeller } from "../middlewares/auth.middleware.js"
import { createProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.js"
import { createProductValidator } from "../validators/product.validator.js";

const productRouter = Router();

productRouter.post("/", authenticateSeller, createProductValidator, upload.array("images", 7), createProduct)

export default productRouter;