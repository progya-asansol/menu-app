const express = require('express');
const mysql = require('mysql2/promise'); // Using promise-based API
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'fooduser', // The user you created
  password: 'password', // The password you set
  database: 'foodDelivery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database and Tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS foodDelivery`);
    await connection.query(`USE foodDelivery`);

    // Create menu_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(255),
        category VARCHAR(100),
        description TEXT,
        rating DECIMAL(3,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table (for order details)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        item_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

    // Check if menu is empty and insert sample data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
    if (rows[0].count === 0) {
      await insertSampleMenu(connection);
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

// Insert sample menu items
async function insertSampleMenu(connection) {
  const sampleItems = [
    // Italian
    ["Margherita Pizza", 12.99, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", "Italian", "Classic pizza with tomato sauce, mozzarella, and basil", 4.5],
    ["Spaghetti Carbonara", 14.50, "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb", "Italian", "Pasta with eggs, cheese, pancetta, and black pepper", 4.7],
    ["Tiramisu", 6.99, "https://images.unsplash.com/photo-1533134242443-d4fd215305ad", "Dessert", "Coffee-flavored Italian dessert", 4.8],
    
    // Indian
    ["Butter Chicken", 15.99, "https://images.unsplash.com/photo-1601050690597-df0568f70950", "Indian", "Tender chicken in creamy tomato sauce", 4.6],
    ["Vegetable Biryani", 13.50, "https://images.unsplash.com/photo-1633945274309-2c16c9682a30", "Indian", "Fragrant rice dish with vegetables", 4.4],
    
    // American
    ["Classic Cheeseburger", 9.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", "American", "Beef patty with cheese and special sauce", 4.3],
    ["BBQ Ribs", 18.99, "https://images.unsplash.com/photo-1544025162-d76694265947", "American", "Slow-cooked pork ribs", 4.7],
    
    // Chinese
    ["Chicken Fried Rice", 11.99, "https://images.unsplash.com/photo-1603133872878-684f208fb84b", "Chinese", "Stir-fried rice with chicken", 4.2],
    ["Vegetable Spring Rolls", 5.99, "https://images.unsplash.com/photo-1585032226651-759b368d7246", "Appetizer", "Crispy rolls with vegetables", 4.0],
    
    // Beverages
    ["Mango Lassi", 3.99, "https://images.unsplash.com/photo-1603569283847-aa295f0d016a", "Beverage", "Refreshing yogurt-based drink", 4.5]
  ];

  await connection.query(
    'INSERT INTO menu_items (name, price, image, category, description, rating) VALUES ?',
    [sampleItems]
  );
  console.log('Sample menu items added');
}

// Routes
app.get('/api/menu', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM menu_items';
    const params = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    const [items] = await pool.query(query, params);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/order', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer, address, phone, total, status) VALUES (?, ?, ?, ?, ?)',
      [req.body.customer, req.body.address, req.body.phone, req.body.total, 'Received']
    );

    // Insert order items
    const orderId = orderResult.insertId;
    const orderItems = req.body.items.map(item => [
      orderId,
      item.id,
      item.name,
      item.price,
      item.quantity
    ]);

    await connection.query(
      'INSERT INTO order_items (order_id, item_id, item_name, item_price, quantity) VALUES ?',
      [orderItems]
    );

    await connection.commit();
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully',
      orderId 
    });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeDatabase();
});