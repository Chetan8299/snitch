import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
}

export const validateRegistration = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("contact")
        .notEmpty()
        .withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("Contact must be a valid 10 digit number"),
    body("password").notEmpty().withMessage("Password is required"),
    body("fullName").notEmpty().withMessage("Full name is required").isLengths({min: 3}).withMessage("Full name must be at least 3 characters long"),
    body("isSeller").isBoolean().withMessage("Is seller must be a boolean"),
    validate
];
