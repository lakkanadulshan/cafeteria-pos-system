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

// 3. Create New Menu Item
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, stock, isAvailable } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res
        .status(400)
        .json({ message: "Name, price, and categoryId are required" });
    }

    const parsedCategoryId = parseInt(categoryId, 10);
    const existingCategory = await prisma.category.findUnique({
      where: { id: parsedCategoryId },
    });

    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: "Specified Category does not exist" });
    }

    // Cloudinary direct URL setup
    let imageUrl = req.body.imageUrl || null;
    if (req.file && req.file.path) {
      imageUrl = req.file.path; 
    }

    const parsedStock = stock !== undefined && stock !== "" ? parseInt(stock, 10) : 0;
    const parsedAvailability = isAvailable !== undefined 
      ? (isAvailable === true || isAvailable === "true") 
      : parsedStock > 0;

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: isNaN(parsedStock) ? 0 : parsedStock,
        categoryId: parsedCategoryId,
        imageUrl,
        isAvailable: parsedAvailability,
      },
      include: { category: true },
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 4. Update Menu Item (Fixed Response Structure & Robust Parsing)
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

    // 🟢 CLOUDINARY IMAGE RESOLUTION
    let imageUrl = existingItem.imageUrl;
    if (req.file && req.file.path) {
      imageUrl = req.file.path; // Cloudinary secure URL
    } else if (req.body.imageUrl !== undefined && req.body.imageUrl !== "") {
      imageUrl = req.body.imageUrl;
    }

    // Safe Numeric Parsing
    const parsedPrice = price !== undefined && price !== "" ? parseFloat(price) : existingItem.price;
    const parsedStock = stock !== undefined && stock !== "" ? parseInt(stock, 10) : existingItem.stock;
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : existingItem.categoryId;

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
        price: isNaN(parsedPrice) ? existingItem.price : parsedPrice,
        stock: isNaN(parsedStock) ? existingItem.stock : parsedStock,
        categoryId: isNaN(parsedCategoryId) ? existingItem.categoryId : parsedCategoryId,
        imageUrl: imageUrl,
        isAvailable: parsedAvailability,
      },
      include: { category: true },
    });

    // 🟢 DIRECT ITEM RETURN (Frontend axios res.data එකට සෘජුවම ගැළපේ)
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 5. Delete Menu Item
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