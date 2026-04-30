import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "INR", "EUR", "GBP", "AUD", "CAD", "CHF", "CNY", "JPY", "KRW", "MXN", "NZD", "RUB", "SAR", "SEK", "SGD", "THB", "TRY", "ZAR"],
            default: "INR"
        }
    },
    images: {
        url: {
            type: String,
            required: true
        },
    }
})