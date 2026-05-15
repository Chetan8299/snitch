import {Schema} from "mongoose";

const priceSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ["USD", "INR", "EUR", "GBP", "AUD", "CAD", "CHF", "CNY", "JPY", "KRW", "MXN", "NZD", "RUB", "SAR", "SEK", "SGD", "THB", "TRY", "ZAR"],
        default: "INR"
    }
}, {
    _id: false,
    _v: false
})

export default priceSchema;

