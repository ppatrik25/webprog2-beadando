const db = require("../routes/db-config.js"); // Import database configuration module
const jwt = require("jsonwebtoken"); // Import jsonwebtoken module for authentication and authorization

const items = (req, res, next) => {
  // Try block to catch any errors during the execution of the function
  try {
    // Verify the JWT token and decode it to get the user ID
    const decoder = jwt.verify(
      req.cookies.userRegistered,
      process.env.JWT_SECRET
    );

    // Update the user's items data in the database
    db.query("UPDATE users SET items = ? WHERE id = ?", [
      JSON.stringify(req.body),
      decoder.id,
    ]);
  } catch (err) {
    // Log any errors that occur during the execution of the function
    console.log(err);
  }
};

// Export the items function as a module
module.exports = items;
