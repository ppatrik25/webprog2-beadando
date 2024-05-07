const db = require("../routes/db-config.js"); // Import database configuration module
const jwt = require("jsonwebtoken"); // Import jsonwebtoken module for authentication and authorization

const furnitures = (req, res, next) => {
  // Try block to catch any errors during the execution of the function
  try {
    // Verify the JWT token and decode it to get the user ID
    const decoder = jwt.verify(
      req.cookies.userRegistered,
      process.env.JWT_SECRET
    );

    // Update the user's furniture data in the database
    db.query(
      "UPDATE users SET furnitures =? WHERE id =?",
      [JSON.stringify(req.body), decoder.id],
      (err, result) => {}
    );

    // Query the database to get the updated furniture data for the user
    db.query(
      "SELECT furnitures FROM users WHERE id =?",
      [decoder.id],
      (err, result) => {
        if (err) return next();

        // Store the updated furniture data in the req.user object
        req.user = result[0].furnitures;

        // Return the updated furniture data
        return req.user;
      }
    );
  } catch (err) {
    // Log any errors that occur during the execution of the function
    console.log(err);
  }
};

// Export the furnitures function as a module
module.exports = furnitures;
