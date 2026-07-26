const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  try {
    // 1. Admin Password Hash
    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        fullName: 'System Administrator',
        passwordHash: adminPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Admin user created:', admin.username);

    // 2. Cashier Password Hash
    const cashierPassword = await bcrypt.hash('cashier123', 10);

    const cashier = await prisma.user.upsert({
      where: { username: 'cashier1' },
      update: {},
      create: {
        username: 'cashier1',
        fullName: 'Nimal Perera',
        passwordHash: cashierPassword,
        role: 'CASHIER',
        isActive: true,
      },
    });

    console.log('✅ Cashier user created:', cashier.username);

    // 3. Sample Menu Items
    const items = [
      { name: 'Chicken Burger', category: 'Snacks', price: 850.00, description: 'Crispy chicken patty with cheese', isAvailable: true },
      { name: 'Iced Coffee', category: 'Beverages', price: 350.00, description: 'Cold brewed coffee with milk', isAvailable: true },
      { name: 'Fried Rice', category: 'Main Meals', price: 1200.00, description: 'Egg and chicken fried rice', isAvailable: true },
    ];

    for (const item of items) {
      await prisma.menuItem.create({ data: item });
    }

    console.log('✅ Sample menu items created!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();