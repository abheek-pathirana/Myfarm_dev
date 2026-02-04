const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function initialize() {
  // First, connect without a database to create it if it doesn't exist
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
  await connection.end();

  // Now create the pool with the database specified
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}

// We need a way to export the pool after it's initialized
// Or use a proxy/getter. For simplicity, let's use a module-level variable and an init function.
let pool;

async function initDb() {
  try {
    if (!pool) {
      pool = await initialize();
    }

    const connection = await pool.getConnection();
    console.log(`Connected to MySQL database: ${process.env.DB_NAME}`);

    await connection.query(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS profiles (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) UNIQUE NOT NULL,
      full_name VARCHAR(255),
      address TEXT,
      gps_location VARCHAR(255),
      phone_number VARCHAR(50),
      birthday VARCHAR(50),
      gender VARCHAR(20),
      referral_source VARCHAR(100),
      referral_id VARCHAR(50),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      product_id VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    connection.release();
    console.log('Database tables initialized.');
  } catch (err) {
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n❌ DATABASE ACCESS DENIED:');
      console.error(`Please check your DB_USER and DB_PASSWORD in the .env file.`);
      console.error(`Current config: User=${process.env.DB_USER}, Password=${process.env.DB_PASSWORD}\n`);
    } else {
      console.error('Error initializing database:', err);
    }
    throw err; // Re-throw to prevent server from starting with a broken DB
  }
}

// Export a proxy or a wrapper to ensure pool is accessed correctly
module.exports = {
  get pool() {
    if (!pool) throw new Error('Database pool not initialized. Call initDb() first.');
    return pool;
  },
  initDb
};
