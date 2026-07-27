const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  try {
    // 1. Admin Account Seed
    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@cafeteria.com' },
      update: {},
      create: {
        email: 'admin@cafeteria.com',
        fullName: 'System Administrator',
        passwordHash: adminPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('Admin user created/verified:', admin.email);

    // 2. Cashier Account Seed
    const cashierPassword = await bcrypt.hash('cashier123', 10);

    const cashier = await prisma.user.upsert({
      where: { email: 'cashier1@cafeteria.com' },
      update: {},
      create: {
        email: 'cashier1@cafeteria.com',
        fullName: 'Nimal Perera',
        passwordHash: cashierPassword,
        role: 'CASHIER',
        isActive: true,
      },
    });

    console.log('Cashier user created/verified:', cashier.email);

    // 3. Sample Menu Items Seed
    const items = [
      { name: 'Chicken Burger', category: 'Snacks', price: 850.00, description: 'Crispy chicken patty with cheese', isAvailable: true },
      { name: 'Iced Coffee', category: 'Beverages', price: 350.00, description: 'Cold brewed coffee with milk', isAvailable: true },
      { name: 'Fried Rice', category: 'Main Meals', price: 1200.00, description: 'Egg and chicken fried rice', isAvailable: true },
    ];

    for (const item of items) {
      const existingItem = await prisma.menuItem.findFirst({
        where: { name: item.name }
      });

      if (!existingItem) {
        await prisma.menuItem.create({ data: item });
      }
    }

    console.log('Sample menu items processed!');

  } catch (error) {
    console.error(' Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();