const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 1. Get All Menu Items
const getAllMenuItems = async (req, res) => {
  try {
    const { categoryId, isAvailable } = req.query;
    const whereClause = {};

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId, 10);
    }

    if (isAvailable !== undefined) {
      whereClause.isAvailable = isAvailable === "true";
    }

    const menuItems = await prisma.menuItem.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Get Single Menu Item by ID
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemId = parseInt(id, 10);

    if (isNaN(menuItemId)) {
      return res.status(400).json({ message: "Invalid Menu Item ID" });
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { category: true },
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Create New Menu Item (Admin Only)
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, stock, isAvailable } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res
        .status(400)
        .json({ message: "Name, price, and categoryId are required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(categoryId, 10) },
    });

    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: "Specified Category does not exist" });
    }

    // CLOUDINARY CHANGE: req.file.path හි Direct Cloud URL එක ලැබෙයි
    let imageUrl = req.body.imageUrl || null;
    if (req.file) {
      imageUrl = req.file.path; 
    }

    const parsedStock = stock !== undefined ? parseInt(stock, 10) : 0;
    
    const parsedAvailability = isAvailable !== undefined 
      ? (isAvailable === true || isAvailable === "true") 
      : parsedStock > 0;

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parsedStock,
        categoryId: parseInt(categoryId, 10),
        imageUrl,
        isAvailable: parsedAvailability,
      },
      include: { category: true },
    });

    return res.status(201).json({
      message: "Menu item created successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Update Menu Item (Admin Only)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemId = parseInt(id, 10);

    if (isNaN(menuItemId)) {
      return res.status(400).json({ message: "Invalid Menu Item ID provided" });
    }

    const { name, description, price, categoryId, stock, isAvailable } = req.body;

    const existingItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (categoryId) {
      const existingCategory = await prisma.category.findUnique({
        where: { id: parseInt(categoryId, 10) },
      });
      if (!existingCategory) {
        return res
          .status(404)
          .json({ message: "Specified Category does not exist" });
      }
    }

    // CLOUDINARY CHANGE: req.file.path භාවිතය
    let imageUrl = existingItem.imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else if (req.body.imageUrl !== undefined) {
      imageUrl = req.body.imageUrl;
    }

    const parsedStock = stock !== undefined ? parseInt(stock, 10) : existingItem.stock;
    
    let parsedAvailability = existingItem.isAvailable;
    if (isAvailable !== undefined) {
      parsedAvailability = (isAvailable === true || isAvailable === "true");
    } else if (stock !== undefined) {
      parsedAvailability = parsedStock > 0;
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        name: name || existingItem.name,
        description: description !== undefined ? description : existingItem.description,
        price: price !== undefined ? parseFloat(price) : existingItem.price,
        stock: parsedStock,
        categoryId: categoryId ? parseInt(categoryId, 10) : existingItem.categoryId,
        imageUrl: imageUrl,
        isAvailable: parsedAvailability,
      },
      include: { category: true },
    });

    return res.status(200).json({
      message: "Menu item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 5. Delete Menu Item (Admin Only)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemId = parseInt(id, 10);

    if (isNaN(menuItemId)) {
      return res.status(400).json({ message: "Invalid Menu Item ID" });
    }

    const existingItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await prisma.menuItem.delete({
      where: { id: menuItemId },
    });

    return res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};