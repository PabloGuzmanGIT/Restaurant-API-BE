const MenuItem = require('../models/MenuItem');

// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      where: { isAvailable: true }
    });

    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Create menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category
    });

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;

    const menuItem = await MenuItem.findByPk(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    await menuItem.update({
      name,
      description,
      price,
      category,
      isAvailable
    });

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete menu item (soft delete by setting isAvailable to false)
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByPk(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    await menuItem.update({ isAvailable: false });

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 