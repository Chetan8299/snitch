import userModel from "../models/user.model";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })

}

export const register = async (req, res) => {
    try {
        const { email, contact, password, fullName, isSeller } = req.body;

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullName,
            role: isSeller ? "seller" : "buyer"
        })

        return await sendTokenResponse(user, res, "User created successfully")
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}