import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkProducts() {
    const products = await prisma.product.findMany();
    console.log('Total products:', products.length);
    products.forEach(p => {
        console.log(`Product: ${p.id}, name: ${p.name}, imageUrls:`, p.imageUrls);
    });
    await prisma.$disconnect();
}

checkProducts();
