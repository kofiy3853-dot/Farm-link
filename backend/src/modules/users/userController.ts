import type { Request, Response } from "express";
import { UserService } from "./userService.js";

export class UserController {
    static async getProfile(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const user = await UserService.getUserById(userId);
            if (!user) return res.status(404).json({ error: "User not found" });

            // Remove password from response
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const {
                name, email,
                farmName, farmSize, experienceYears, certifications, district,
                businessName, industryType, businessLicense,
                fleetSize, vehicleTypes, serviceRegions
            } = req.body;

            const dataToUpdate: any = {
                name, email, farmName, certifications, district,
                businessName, industryType, businessLicense,
                vehicleTypes, serviceRegions
            };

            if (farmSize !== undefined) dataToUpdate.farmSize = parseFloat(farmSize);
            if (experienceYears !== undefined) dataToUpdate.experienceYears = parseInt(experienceYears);
            if (fleetSize !== undefined) dataToUpdate.fleetSize = parseInt(fleetSize);

            // Strip undefineds for exactOptionalPropertyTypes
            Object.keys(dataToUpdate).forEach(k => dataToUpdate[k] === undefined && delete dataToUpdate[k]);

            const updatedUser = await UserService.updateUser(userId, dataToUpdate);

            // Remove password from response
            const { password, ...userWithoutPassword } = updatedUser;
            res.json(userWithoutPassword);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getUserById(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing user id" });

            const user = await UserService.getUserById(id);
            if (!user) return res.status(404).json({ error: "User not found" });

            // Remove sensitive fields from public response
            const { password, email, ...userWithoutSensitiveInfo } = user;
            res.json(userWithoutSensitiveInfo);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getFarmers(req: Request, res: Response) {
        try {
            const farmers = await UserService.getFarmers();
            res.json(farmers);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getFarmerAnalytics(req: Request, res: Response) {
        try {
            // @ts-ignore
            const farmerId = req.user.id;
            const analytics = await UserService.getFarmerAnalytics(farmerId);
            res.json(analytics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getBuyerAnalytics(req: Request, res: Response) {
        try {
            // @ts-ignore
            const buyerId = req.user.id;
            const analytics = await UserService.getBuyerAnalytics(buyerId);
            res.json(analytics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
