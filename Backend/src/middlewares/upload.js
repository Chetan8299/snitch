import multer from "multer";

export const MAX_IMAGE_FILE_MB = 10;
const MAX_BYTES = MAX_IMAGE_FILE_MB * 1024 * 1024;

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: MAX_BYTES },
    defParamCharset: "utf8",
});

const productImagesParser = upload.array("images", 7);

/**
 * Parses multipart `images` (up to 7, max size each). Responds with JSON for Multer limit errors instead of a generic 500.
 */
export function uploadProductImages(req, res, next) {
    productImagesParser(req, res, (err) => {
        if (!err) {
            next();
            return;
        }

        if (err instanceof multer.MulterError) {
            const { code } = err;
            if (code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({
                    message: `Image too large. Each file must be ${MAX_IMAGE_FILE_MB} MB or less.`,
                    code,
                });
            }
            if (code === "LIMIT_FILE_COUNT") {
                return res.status(400).json({
                    message: "Too many images. You can upload at most 7 files.",
                    code,
                });
            }
            if (code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                    message: "Unexpected file field. Use the field name \"images\" for uploads.",
                    code,
                });
            }
            return res.status(400).json({
                message: err.message || "Upload could not be processed.",
                code,
            });
        }

        next(err);
    });
}
