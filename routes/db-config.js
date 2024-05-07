// Import the 'mysql' package for database interaction
const sql = require("mysql");

// Import the 'dotenv' package for managing environment variables
require("dotenv").config();

// Create a database connection using environment variables
const db = sql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Export the database connection object for use in other parts of the application
module.exports = db;
