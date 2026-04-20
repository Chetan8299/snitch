import { Router } from "express";
import { validateRegistration } from "../validators/auth.validator";

const authRouter = Router();

authRouter.post("register", validateRegistration, register)

export default authRouter;