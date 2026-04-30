import { Router } from "express";
import {
  validateRegistration,
  validateLogin,
} from "../validators/auth.validator.js";
import {
  register,
  login,
  googleCallback,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { env } from "../config/env.js";

const authRouter = Router();

authRouter.post("register", validateRegistration, register);
authRouter.post("login", validateLogin, login);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      env.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login",
  }),
  googleCallback,
);
export default authRouter;
