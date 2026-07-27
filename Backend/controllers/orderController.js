const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Create New Order (POST /api/orders)
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user.userId; // JWT Middleware එකෙන් එන User ID එක

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    // Transaction - Calculate exact total and create Order + OrderItems together
    const newOrder = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { id: parseInt(item.menuItemId, 10) }
        });

        if (!menuItem) {
          throw new Error(`Menu Item with ID ${item.menuItemId} not found`);
        }

        if (!menuItem.isAvailable) {
          throw new Error(`Menu Item '${menuItem.name}' is currently unavailable`);
        }

        const itemPrice = parseFloat(menuItem.price);
        const subtotal = itemPrice * parseInt(item.quantity, 10);
        totalAmount += subtotal;

        // DB schema එකේ තියෙන්නේ 'price'
        orderItemsData.push({
          menuItemId: menuItem.id,
          quantity: parseInt(item.quantity, 10),
          price: itemPrice 
        });
      }

      // Create Order in DB
      return await tx.order.create({
        data: {
          totalAmount: totalAmount,
          paymentMethod: paymentMethod || 'CASH',
          userId: userId,
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: {
            include: {
              menuItem: true
            }
          },
          user: {
            select: { id: true, fullName: true, email: true, role: true }
          }
        }
      });
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(400).json({ message: error.message || "Failed to create order" });
  }
};

// 2. Get All Orders with Filters (GET /api/orders?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&cashierId=1)
exports.getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate, cashierId, status } = req.query;
    const whereClause = {};

    // Filter by Cashier (User ID)
    if (cashierId) {
      whereClause.userId = parseInt(cashierId, 10);
    }

    // Filter by Status (PENDING, COMPLETED, CANCELLED)
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    // Filter by Date Range
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = end;
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        _count: { select: { orderItems: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Get Single Order Details / Receipt View (GET /api/orders/:id)
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            menuItem: { select: { id: true, name: true, price: true, category: true } }
          }
        },
        user: { select: { id: true, fullName: true, email: true, role: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Update Order Status (PATCH /api/orders/:id/status)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orderId = parseInt(id, 10);

    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ 
        message: "Invalid status. Allowed values: PENDING, COMPLETED, CANCELLED" 
      });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status.toUpperCase() }
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};