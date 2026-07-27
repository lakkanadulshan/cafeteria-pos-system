const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    return res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { menuItems: true } 
        }
      }
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ 
      message: "Error fetching categories", 
      error: error.message 
    });
  }
};