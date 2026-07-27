const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get All Users List (GET /api/users) - Admin Only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Change User Role (PUT /api/users/:id/role) - Admin Only
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const validRoles = ['ADMIN', 'CASHIER'];
    if (!role || !validRoles.includes(role.toUpperCase())) {
      return res.status(400).json({ message: "Invalid role. Allowed values: ADMIN, CASHIER" });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role.toUpperCase() },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    return res.status(200).json({
      message: `User role updated to ${updatedUser.role} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Activate or Deactivate User Status (PATCH /api/users/:id/status) - Admin Only
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: "isActive field must be a boolean (true/false)" });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.userId === userId && !isActive) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    const statusMessage = updatedUser.isActive ? "activated" : "deactivated";

    return res.status(200).json({
      message: `User account ${statusMessage} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};