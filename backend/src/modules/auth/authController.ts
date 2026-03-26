import type { Request, Response } from "express";
import { authservice } from "./authService.js";

export class AuthController {
    static async register(req:Request,res:Response){
        try {
            const {name,email,password,role} = req.body;
            const user = await authservice.register(name,password,email,role);
            res.status(201).json(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            res.status(500).json({error: message});
        }
    }
    static async login(req:Request,res:Response){
        try {
            const {email,password} = req.body;
            const user = await authservice.login(email,password);
            res.status(200).json(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            res.status(500).json({error: message});
        }
    }
}