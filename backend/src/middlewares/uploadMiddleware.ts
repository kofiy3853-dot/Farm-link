import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.resolve(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowed = ["image/jpeg", "image/webp", "image/png", "video/mp4", "video/webm", "video/quicktime"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else cb(new Error("Invalid file type: " + file.mimetype), false);
};

export const upload = multer({ storage, fileFilter });
