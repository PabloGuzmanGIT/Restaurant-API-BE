const MenuItem = require('../models/MenuItem');

const menuItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza',
    isAvailable: true
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Pizza topped with pepperoni and mozzarella cheese',
    price: 14.99,
    category: 'Pizza',
    isAvailable: true
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 8.99,
    category: 'Salads',
    isAvailable: true
  },
  {
    name: 'Spaghetti Bolognese',
    description: 'Spaghetti with traditional meat sauce',
    price: 13.99,
    category: 'Pasta',
    isAvailable: true
  },
  {
    name: 'Chicken Alfredo',
    description: 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken',
    price: 15.99,
    category: 'Pasta',
    isAvailable: true
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 4.99,
    category: 'Appetizers',
    isAvailable: true
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 6.99,
    category: 'Desserts',
    isAvailable: true
  },
  {
    name: 'Coca Cola',
    description: 'Refreshing carbonated drink',
    price: 2.99,
    category: 'Beverages',
    isAvailable: true
  },
  {
    name: 'Mineral Water',
    description: 'Sparkling mineral water',
    price: 1.99,
    category: 'Beverages',
    isAvailable: true
  }
];

const seedMenuItems = async () => {
  try {
    // Check if we already have menu items
    const count = await MenuItem.count();
    if (count === 0) {
      await MenuItem.bulkCreate(menuItems);
      console.log('Menu items seeded successfully');
    } else {
      console.log('Menu items already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding menu items:', error);
  }
};

module.exports = seedMenuItems; 