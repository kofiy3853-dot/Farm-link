import { prisma } from "../../config/prisma.js";
import { hashpassword, comparepassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";
import { Role } from "@prisma/client";

export class authservice {
    static async register(name: string, password: string, email: string, role: string) {
        const exiting = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (exiting) {
            throw new Error("User already exists")
        }
        const hashedpassword = await hashpassword(password)
        let dbRole: Role = Role.CUSTOMER;
        const normRole = role.toUpperCase();
        if (normRole === "FARMER") dbRole = Role.FARMER;
        if (normRole === "LOGISTICS") dbRole = Role.LOGISTICS;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedpassword,
                role: dbRole,
            }
        })
        const token = generateToken({ id: user.id, role: user.role })
        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            throw new Error("User not found")
        }
        const invalid = await comparepassword(password, user.password)
        if (!invalid) {
            throw new Error("Invalid credentials")
        }
        const token = generateToken({ id: user.id, role: user.role })
        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
}