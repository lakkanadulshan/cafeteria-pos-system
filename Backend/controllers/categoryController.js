const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Create Category
exports.createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    name = name.trim();

    const existingCategory = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
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

// 2. Get All Categories (With Menu Items Count)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { menuItems: true } 
        }
      },
      orderBy: { id: 'asc' }
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ 
      message: "Error fetching categories", 
      error: error.message 
    });
  }
};

// 3. Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    // Check if category has linked food items
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { menuItems: true } } }
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category._count.menuItems > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category because it contains active food items. Remove or reassign those items first." 
      });
    }

    await prisma.category.delete({ where: { id: categoryId } });
    return res.status(200).json({ message: "Category deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};