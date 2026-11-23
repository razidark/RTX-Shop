import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting order seeding...');
    
    // Get users and products from database
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();
    
    if (users.length === 0) {
      console.error('No users found in database. Run check_db_status or register some users first.');
      return;
    }
    
    if (products.length === 0) {
      console.error('No products found in database. Run seed_products.js first.');
      return;
    }

    console.log(`Found ${users.length} users and ${products.length} products.`);
    
    // Clean old orders first to avoid duplicates
    console.log('Cleaning old orders...');
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    console.log('Old orders cleaned.');

    const orderStatuses = ['DELIVERED', 'SHIPPED', 'PROCESSING', 'PENDING', 'CANCELLED'];
    const statusWeights = [0.65, 0.15, 0.08, 0.08, 0.04]; // Probabilities summing to 1.0

    const getRandomStatus = () => {
      const r = Math.random();
      let cumulative = 0;
      for (let i = 0; i < orderStatuses.length; i++) {
        cumulative += statusWeights[i];
        if (r <= cumulative) return orderStatuses[i];
      }
      return 'DELIVERED';
    };

    const numOrders = 45; // Seed 45 orders to have a solid amount of data
    console.log(`Generating ${numOrders} mock orders spread over the last 30 days...`);

    for (let i = 0; i < numOrders; i++) {
      // Pick a random user
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Select 1 to 3 random products
      const orderProducts = [];
      const numProducts = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < numProducts; j++) {
        orderProducts.push(shuffled[j]);
      }

      // Generate date in the last 30 days
      const date = new Date();
      // Evenly distribute orders over the last 30 days with some randomness
      const daysAgo = (i / numOrders) * 30 + (Math.random() * 0.5 - 0.25);
      const hoursAgo = Math.random() * 24;
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);

      const status = getRandomStatus();

      // Create order first
      let total = 0;
      const itemsData = orderProducts.map(p => {
        const qty = Math.floor(Math.random() * 2) + 1; // 1 or 2 items
        total += p.price * qty;
        return {
          productId: p.id,
          quantity: qty,
          price: p.price
        };
      });

      // Insert Order with items nested
      await prisma.order.create({
        data: {
          userId: user.id,
          total: parseFloat(total.toFixed(2)),
          status,
          createdAt: date,
          address: 'Av. Paulista, 1000 - São Paulo, SP',
          items: {
            create: itemsData
          }
        }
      });
    }

    console.log('Mock orders seeded successfully!');
  } catch (error) {
    console.error('Error during seeding orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
