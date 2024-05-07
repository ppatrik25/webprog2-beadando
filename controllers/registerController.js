const db = require("../routes/db-config.js"); // Import database configuration module
const bcrypt = require("bcryptjs"); // Import bcryptjs module for password hashing

const register = async (req, res) => {
  // Extract the email and password (as Npassword for later hashing) from the request body
  const { email, password: Npassword } = req.body;

  // Check if the email and password are provided
  if (!email || !Npassword) {
    return res.json({
      status: "error",
      error: "Hiányzó e-mail cím vagy jelszó!",
    });
  } else {
    // Query the database to check if the email already exists
    db.query(
      `SELECT email FROM users WHERE email =?`,
      [email],
      async (err, result) => {
        // Handle any database errors
        if (err) throw err;

        // If the email already exists, return an error message
        if (result.length > 0) {
          return res.json({
            status: "error",
            error: "Ez az e-mail cím már foglalt!",
          });
        } else {
          // Hash the password using bcrypt
          const password = await bcrypt.hash(Npassword, 8);

          // Insert the new user into the database
          db.query(
            `INSERT INTO users SET?`,
            { email: email, password: password },
            (error, result) => {
              // Handle any database errors
              if (error) throw error;

              // Return a success message
              return res.json({
                status: "success",
                success: "Sikeres regisztráció!",
              });
            }
          );
        }
      }
    );
  }
};

// Export the register function
module.exports = register;
