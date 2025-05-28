const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const menuItemRoutes = require('./routes/menuItem');
const tableSessionRoutes = require('./routes/tableSession');
const backOfficeRoutes = require('./routes/backOffice');
const adminRoutes = require('./routes/admin');
const seedMenuItems = require('./seeders/menuItems');
const seedTestData = require('./seeders/testData');
const swaggerSpecs = require('./swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/table-sessions', tableSessionRoutes);
app.use('/api/backoffice', backOfficeRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Seed menu items
    await seedMenuItems();

    // Sync and seed test data
    await sequelize.sync({ force: true });
    console.log('Database synced');
    await seedTestData();
    console.log('Test data seeded');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer(); 