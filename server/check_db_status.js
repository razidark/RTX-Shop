import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    
    console.log(`Users count: ${userCount}`);
    console.log(`Products count: ${productCount}`);
    console.log(`Orders count: ${orderCount}`);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    console.log('All Users:');
    console.dir(users, { depth: null });
  } catch (error) {
    console.error('Database connection check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
