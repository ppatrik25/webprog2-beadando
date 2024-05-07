const db = require("../routes/db-config.js"); // Import database configuration module
const jwt = require("jsonwebtoken"); // Import jsonwebtoken module for authentication and authorization

const loggedIn = (req, res, next) => {
  // Check if the userRegistered cookie exists
  if (!req.cookies.userRegistered) return next();

  try {
    // Verify the JWT token and decode it to get the user ID
    const decoder = jwt.verify(
      req.cookies.userRegistered,
      process.env.JWT_SECRET
    );

    // Query the database to get the user data
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [decoder.id],
      (err, result) => {
        if (err) {
          // Log any database errors
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }

        // Store the user data in the req.user object
        req.user = result[0];

        // Continue with the next middleware function
        return next();
      }
    );
  } catch (err) {
    // Log any errors that occur during the JWT verification
    console.error(err);
    return res.status(401).redirect("/");
  }
};

// Export the loggedIn function as a module
module.exports = loggedIn;
