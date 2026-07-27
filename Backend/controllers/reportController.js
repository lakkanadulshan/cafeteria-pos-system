const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Daily Sales Summary (GET /api/reports/daily-sales?date=YYYY-MM-DD)
exports.getDailySales = async (req, res) => {
  try {
    const { date } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter valid COMPLETED orders for the day
    const salesSummary = await prisma.order.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      _sum: {
        totalAmount: true
      },
      _count: {
        id: true
      }
    });

    return res.status(200).json({
      date: startOfDay.toISOString().split('T')[0],
      totalRevenue: salesSummary._sum.totalAmount || 0,
      totalOrders: salesSummary._count.id || 0
    });

  } catch (error) {
    console.error("Error fetching daily sales report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Top Selling Menu Items (GET /api/reports/top-items?limit=5)
exports.getTopSellingItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    // Group order items by menuItemId and sum the quantities
    const topItemsGrouped = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          status: 'COMPLETED'
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    });

    // Get full Details of those Top Menu Items
    const topItemsDetails = await Promise.all(
      topItemsGrouped.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
          select: { id: true, name: true, price: true, category: { select: { name: true } } }
        });

        return {
          menuItem,
          totalQuantitySold: item._sum.quantity
        };
      })
    );

    return res.status(200).json(topItemsDetails);

  } catch (error) {
    console.error("Error fetching top selling items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};