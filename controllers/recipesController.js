const db = require("../routes/db-config.js"); // Import database configuration module
const jwt = require("jsonwebtoken"); // Import jsonwebtoken module for authentication and authorization

const recipes = (req, res, next) => {
  try {
    // Verify jwt to authenticate the user and retrieve user id
    const decoder = jwt.verify(
      req.cookies.userRegistered,
      process.env.JWT_SECRET
    );

    // Handle POST request to create a new recipe
    if (req.method === "POST") {
      // Add user_id to the request body to associate the recipe with the user
      req.body.user_id = decoder.id;

      // Execute a SQL query to insert a new recipe into the database
      db.query(
        "INSERT INTO recipes (title, ingredients, description, user_id) VALUES (?,?,?,?)",
        [
          req.body.title,
          req.body.ingredients,
          req.body.description,
          req.body.user_id,
        ],
        (err, result) => {
          if (err) {
            // Log any errors that occur during query execution
            console.error(err);
            return;
          }
        }
      );
    }
    // Handle GET request to fetch recipes
    else if (req.method === "GET") {
      // Execute a SQL query to fetch recipes for the current user
      db.query(
        "SELECT * FROM recipes WHERE recipes.user_id =?",
        [decoder.id],
        (err, result) => {
          if (err) {
            // Log any errors that occur during query execution
            console.error(err);
            // Return Error 500 if query fails
            return res.status(500).send("Internal Server Error");
          }
          // Store user recipes in the request object for further processing
          req.user_recipes = result;

          // Execute a SQL query to fetch all recipes from the database
          db.query("SELECT * FROM recipes", (err, result) => {
            if (err) {
              // Log any errors that occur during query execution
              console.error(err);
              // Return Error 500 if query fails
              return res.status(500).send("Internal Server Error");
            }
            // Store all recipes in the request object for further processing
            req.recipes = result;
            // Call the next middleware function
            return next();
          });
        }
      );
    }
  } catch (err) {
    // Redirect to the homepage if there's an error during jwt verification or other operations
    res.status(404).redirect("/");
  }
};

// Export the recipes function as a module
module.exports = recipes;
