import { prisma } from "./src/config/prisma.js";
import { hashpassword } from "./src/utils/password.js";
import { Role, Category } from "@prisma/client";

async function seedData() {
    console.log("Seeding Database with V2 Premium Marketplace Data...");

    try {
        const hashedPassword = await hashpassword("password123");

        // 1. Create a Verified Farmer
        const verifiedFarmer = await prisma.user.upsert({
            where: { email: "kwesi.farmer@farmlink.com" },
            update: { isVerified: true, rating: 4.8, totalSales: 124 },
            create: {
                name: "Kwesi Mensah (Ashanti Coop)",
                email: "kwesi.farmer@farmlink.com",
                password: hashedPassword,
                role: Role.FARMER,
                isVerified: true,
                rating: 4.8,
                totalSales: 124
            }
        });

        const newFarmer = await prisma.user.upsert({
            where: { email: "abena.agri@farmlink.com" },
            update: { isVerified: false, rating: 0, totalSales: 0 },
            create: {
                name: "Abena Farms Ltd.",
                email: "abena.agri@farmlink.com",
                password: hashedPassword,
                role: Role.FARMER,
                isVerified: false,
                rating: 0,
                totalSales: 0
            }
        });

        console.log(`Created Farmers: ${verifiedFarmer.name}, ${newFarmer.name}`);

        // 2. Create V2 High-Fidelity Products
        const products = [
            {
                name: "Premium White Maize (Bulk)",
                price: 1250,
                imageUrl: "/images/maize.svg",
                description: "High-quality, dried white maize suitable for milling and industrial use. Sun-dried and sorted.",
                category: Category.GRAINS,
                region: "Ashanti Region",
                availableQuantity: 50,
                minOrderQuantity: 5,
                qualityGrade: "Grade A",
                isOrganic: false,
                views: 342,
                farmerId: verifiedFarmer.id
            },
            {
                name: "100% Organic Cherry Tomatoes",
                price: 950,
                imageUrl: "/images/tomatoes.svg",
                description: "Freshly harvested organic cherry tomatoes, perfect for export or premium supermarkets.",
                category: Category.VEGETABLES,
                region: "Brong Ahafo Region",
                availableQuantity: 12,
                minOrderQuantity: 1,
                qualityGrade: "Premium",
                isOrganic: true,
                views: 1205,
                farmerId: verifiedFarmer.id
            },
            {
                name: "Raw Groundnuts (Shelled)",
                price: 2400,
                imageUrl: "/images/groundnut.svg",
                description: "Cleaned and shelled raw groundnuts straight from the Northern savanna.",
                category: Category.GRAINS,
                region: "Northern Region",
                availableQuantity: 120,
                minOrderQuantity: 10,
                qualityGrade: "Grade A",
                isOrganic: false,
                views: 56,
                farmerId: newFarmer.id
            },
            {
                name: "Fresh Yams (Pona)",
                price: 600,
                imageUrl: "/images/yam.svg",
                description: "Famous Pona yams, large tubers averaging 3kg each. Perfect for roasting or boiling.",
                category: Category.VEGETABLES,
                region: "Bono Region",
                availableQuantity: 300,
                minOrderQuantity: 50,
                qualityGrade: "Standard",
                isOrganic: true,
                views: 890,
                farmerId: verifiedFarmer.id
            },
            {
                name: "Live Broiler Chickens",
                price: 120,
                imageUrl: "/images/chicken.svg",
                description: "Healthy, fully matured broiler chickens averaging 2.5kg. Vaccinated and ready for processing.",
                category: Category.MEAT,
                region: "Greater Accra",
                availableQuantity: 500,
                minOrderQuantity: 50,
                qualityGrade: "Standard",
                isOrganic: false,
                views: 210,
                farmerId: newFarmer.id
            },
            {
                name: "Fresh Cow Milk (Unpasteurized)",
                price: 45,
                imageUrl: "/images/milk.svg",
                description: "Freshly milked cow milk straight from the dairy farm. Needs pasteurization.",
                category: Category.DAIRY,
                region: "Volta Region",
                availableQuantity: 100,
                minOrderQuantity: 10,
                qualityGrade: "Grade B",
                isOrganic: true,
                views: 65,
                farmerId: verifiedFarmer.id
            }
        ];

        // Delete existing products to avoid duplicates / old schema issues
        await prisma.product.deleteMany({});

        for (const pData of products) {
            const { imageUrl, ...rest } = pData as any;
            await prisma.product.create({
                data: {
                    ...rest,
                    imageUrls: [imageUrl]
                }
            });
        }

        console.log(`Successfully seeded ${products.length} V2 Marketplace Products!`);

        // 3. Create mock orders to populate Market Intelligence
        const seededProducts = await prisma.product.findMany({});

        for (const p of seededProducts) {
            await prisma.order.create({
                data: {
                    customerId: verifiedFarmer.id, // Verified farmer can also be a buyer for this test
                    productId: p.id,
                    quantity: Math.floor(Math.random() * 5) + 1,
                    totalprice: p.price * (Math.floor(Math.random() * 5) + 1),
                    status: 'completed',
                    paymentStatus: 'RELEASED'
                }
            });
        }
        console.log("Seeded mock orders for Market Intelligence.");

    } catch (e) {
        console.error("Error seeding V2 data:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seedData();
