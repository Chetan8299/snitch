import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./config/env.js";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(morgan("dev"));

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",

    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running.",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter)

export default app;
