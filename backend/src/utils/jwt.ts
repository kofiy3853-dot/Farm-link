import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
const secretKey: Secret = process.env.JWT_SECRET || "fallback_secret_key";

const DEFAULT_EXPIRES_IN = "7d" as const;

export function generateToken(
    payload: object,
    expiresIn: SignOptions["expiresIn"] = DEFAULT_EXPIRES_IN
) {
    return jwt.sign(payload, secretKey, { expiresIn });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, secretKey);
    } catch {
        return null;
    }
}
