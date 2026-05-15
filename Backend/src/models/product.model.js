import { Schema, model } from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        type: priceSchema,
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
    }],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema,
            }
        }
    ]
}, {
    timestamps: true
})

const productModel = model("product", productSchema);

export default productModel;