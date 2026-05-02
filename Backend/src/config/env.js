import { config } from "dotenv";

config();

if (!process.env.MONGO_URI) {
    throw new Error("Mongo db uri not present in env")
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google client id not present in env")
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google client secret not present in env")
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("ImageKit private key not present in env")
}

export const env = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
}