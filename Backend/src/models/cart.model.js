import { Schema, model } from "mongoose";
import priceSchema from "./price.schema.js";

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            variant: {
                type: Schema.Types.ObjectId,
                ref: "product.variants"
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
})

const cartModel = model("cart", cartSchema);

export default cartModel;