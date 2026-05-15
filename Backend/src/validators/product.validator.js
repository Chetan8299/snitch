import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next();
}


export const createProductValidator = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("priceAmount").trim().notEmpty().withMessage("Price amount is required"),
    body("priceCurrency").optional().isIn(["USD", "INR", "EUR", "GBP", "AUD", "CAD", "CHF", "CNY", "JPY", "KRW", "MXN", "NZD", "RUB", "SAR", "SEK", "SGD", "THB", "TRY", "ZAR"]).withMessage("Invalid price currency"),
    validate
]