import cookieParser from "cookie-parser";
import express, { urlencoded } from "express"
import morgan from "morgan";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({
    extended: true
}));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running."
    })
})

app.use("/api/auth", authRouter)

export default app;