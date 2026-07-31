const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Create New Order with Real-Time Stock Reduction
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user.userId; 

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    // Transaction - Verify stock, calculate total, create order & auto-deduct stock
    const newOrder = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const menuItemIdParsed = parseInt(item.menuItemId, 10);
        const orderQty = parseInt(item.quantity, 10);

        const menuItem = await tx.menuItem.findUnique({
          where: { id: menuItemIdParsed }
        });

        if (!menuItem) {
          throw new Error(`Menu Item with ID ${item.menuItemId} not found`);
        }

        if (!menuItem.isAvailable) {
          throw new Error(`Menu Item '${menuItem.name}' is currently unavailable/out of stock`);
        }

        // Check stock capacity
        if (menuItem.stock < orderQty) {
          throw new Error(`Insufficient stock for '${menuItem.name}'. Remaining: ${menuItem.stock}`);
        }

        const itemPrice = parseFloat(menuItem.price);
        const subtotal = itemPrice * orderQty;
        totalAmount += subtotal;

        orderItemsData.push({
          menuItemId: menuItem.id,
          quantity: orderQty,
          price: itemPrice 
        });

        // 👈 AUTO DEDUCT STOCK & Auto-Toggle availability if stock hits 0
        const updatedStock = menuItem.stock - orderQty;
        await tx.menuItem.update({
          where: { id: menuItem.id },
          data: {
            stock: { decrement: orderQty },
            isAvailable: updatedStock > 0
          }
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
            include: { menuItem: true }
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

// 2. Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate, cashierId, status } = req.query;
    const whereClause = {};

    if (cashierId) whereClause.userId = parseInt(cashierId, 10);
    if (status) whereClause.status = status.toUpperCase();

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
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

// 3. Get Single Order Details
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid Order ID" });

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

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orderId = parseInt(id, 10);

    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) return res.status(404).json({ message: "Order not found" });

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