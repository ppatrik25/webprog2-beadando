const db = require("../routes/db-config.js"); // Import database configuration module
const jwt = require("jsonwebtoken"); // Import jsonwebtoken module for authentication and authorization
const bcrypt = require("bcryptjs"); // Import bcryptjs module for password hashing

const login = async (req, res) => {
  // Extract the email and password from the request body
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password)
    return res.json({
      status: "error",
      error: "Hiányzó e-mail cím vagy jelszó!",
    });

  // Query the database to get the user data
  db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, result) => {

      if (err) throw err;

      // Check if the user exists and the password is correct
      if (
        !result.length ||
        !(await bcrypt.compare(password, result[0].password))
      ) {
        return res.json({
          status: "error",
          error: "Hibás e-mail cím vagy jelszó!",
        });
      } else {
        // Generate a JWT token with the user ID
        const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });

        // Set the cookie with the JWT token
        const cookieOptions = {
          maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
          httpsOnly: true,
        };
        res.cookie("userRegistered", token, cookieOptions);

        // Return a success response
        return res.json({
          status: "success",
          success: "Sikeres bejelentkezés!",
        });
      }
    }
  );
};

// Export the login function as a module
module.exports = login;
