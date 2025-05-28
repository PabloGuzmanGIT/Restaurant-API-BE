const bcrypt = require('bcryptjs');
const Company = require('../models/Company');
const User = require('../models/User');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const TableSession = require('../models/TableSession');
const Order = require('../models/Order');

const seedTestData = async () => {
  try {
    // Create test company
    const company = await Company.create({
      companyName: 'Test Restaurant',
      ruc: '12345678901',
      email: 'test@restaurant.com'
    });

    // Create test users
    const adminUser = await User.create({
      userId: 'admin',
      password: 'admin123',
      role: 'admin',
      companyId: company.id
    });

    const frontdeskUser = await User.create({
      userId: 'frontdesk',
      password: 'frontdesk123',
      role: 'frontdesk',
      companyId: company.id
    });

    const backofficeUser = await User.create({
      userId: 'backoffice',
      password: 'backoffice123',
      role: 'backoffice',
      companyId: company.id
    });

    // Create test tables
    const tables = await Promise.all([
      Table.create({ tableNumber: 1, capacity: 4, location: 'Main Floor', companyId: company.id }),
      Table.create({ tableNumber: 2, capacity: 2, location: 'Main Floor', companyId: company.id }),
      Table.create({ tableNumber: 3, capacity: 6, location: 'Main Floor', companyId: company.id }),
      Table.create({ tableNumber: 4, capacity: 4, location: 'Main Floor', companyId: company.id }),
      Table.create({ tableNumber: 5, capacity: 8, location: 'Main Floor', companyId: company.id })
    ]);

    // Create test menu items
    const menuItems = await Promise.all([
      MenuItem.create({
        name: 'Margherita Pizza',
        description: 'Classic tomato sauce, mozzarella, and basil',
        price: 12.99,
        category: 'Pizza',
        companyId: company.id
      }),
      MenuItem.create({
        name: 'Caesar Salad',
        description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing',
        price: 8.99,
        category: 'Salads',
        companyId: company.id
      }),
      MenuItem.create({
        name: 'Spaghetti Bolognese',
        description: 'Spaghetti with meat sauce',
        price: 14.99,
        category: 'Pasta',
        companyId: company.id
      }),
      MenuItem.create({
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with chocolate ganache',
        price: 6.99,
        category: 'Desserts',
        companyId: company.id
      })
    ]);

    // Create test table sessions
    const tableSession1 = await TableSession.create({
      tableNumber: 1,
      status: 'open',
      startTime: new Date(),
      companyId: company.id,
      createdBy: frontdeskUser.id
    });

    const tableSession2 = await TableSession.create({
      tableNumber: 2,
      status: 'open',
      startTime: new Date(),
      companyId: company.id,
      createdBy: frontdeskUser.id
    });

    // Create test orders
    await Promise.all([
      Order.create({
        tableSessionId: tableSession1.id,
        menuItemId: menuItems[0].id,
        quantity: 2,
        status: 'pending',
        notes: 'Extra cheese please'
      }),
      Order.create({
        tableSessionId: tableSession1.id,
        menuItemId: menuItems[1].id,
        quantity: 1,
        status: 'served',
        notes: 'No croutons'
      }),
      Order.create({
        tableSessionId: tableSession2.id,
        menuItemId: menuItems[2].id,
        quantity: 1,
        status: 'preparing',
        notes: 'Extra sauce'
      })
    ]);

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
};

module.exports = seedTestData; 