import { prisma } from "./src/config/prisma.js";
import { hashpassword } from "./src/utils/password.js";
import { Role } from "@prisma/client";

async function seedAdmin() {
    console.log("Seeding admin user...");
    const email = "admin@farmlink.com";
    const password = "adminpassword123";

    try {
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            console.log("Admin already exists!");
            return;
        }

        const hashedPassword = await hashpassword(password);

        const admin = await prisma.user.create({
            data: {
                name: "System Administrator",
                email: email,
                password: hashedPassword,
                role: Role.ADMIN,
            }
        });

        console.log(`Successfully created admin user: ${admin.email}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
