import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        (req as any).user = decoded;
        return next();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unauthorized";
        return res.status(401).json({ message });
    }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if ((req as any).user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
}