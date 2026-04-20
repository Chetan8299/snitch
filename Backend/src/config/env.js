import { config } from "dotenv";

config();

if (!process.env.MONGO_URI) {
    throw new Error("Mongo db uri not present in env")
}

export default env = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
}