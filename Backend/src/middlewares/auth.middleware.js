import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import userModel from "../models/user.model.js";

/** Avoid TCP RST / net::ERR_CONNECTION_RESET when rejecting early while a large multipart body is still uploading. */
function drainIncomingBody(req) {
    if (req.readable && !req.readableEnded) {
        req.resume();
    }
}

function authJson(req, res, status, body) {
    drainIncomingBody(req);
    return res.status(status).json(body);
}

export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return authJson(req, res, 401, { message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return authJson(req, res, 401, { message: "Unauthorized" });
        }

        if (user.role !== "seller") {
            return authJson(req, res, 403, {
                message: "Seller account required for this action",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return authJson(req, res, 401, { message: "Unauthorized" });
    }
};