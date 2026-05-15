import productModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"

export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async file => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })

    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}

export async function getProductsForSeller(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getProducts(req, res) {
    const products = await productModel.find();

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getProductDetails(req, res) {
    const { productId } = req.params;

    const product = await productModel.findById(productId).populate("seller", "fullName email");

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false,
            product: null
        })
    }

    res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
}

export async function createProductVariant(req, res) {
    const { productId } = req.params;
    console.log(req.body);

    const { stock, priceAmount, priceCurrency, attributes, imageCount } = JSON.parse(req.body.variant);

    const images = imageCount > 0 ? await Promise.all(req.files.map(async file => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    })) : [];

    const productVariant = await productModel.findByIdAndUpdate(productId, {
        $push: {
            variants: {
                images,
                stock,
                price: {
                    amount: priceAmount,
                    currency: priceCurrency || "INR"
                },
                attributes,
            }
        }
    })

    res.status(201).json({
        message: "Product variant created successfully",
        success: true,
        productVariant
    });
}