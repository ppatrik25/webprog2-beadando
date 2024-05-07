// Import the controller functions
const express = require("express");
const register = require("./registerController");
const login = require("./loginController");
const furnitures = require("./furnituresController");
const items = require("./itemsController");
const recipes = require("./recipesController");

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Furnitures route
router.post("/furnitures", furnitures);

// Items route
router.post("/items", items);

// Recipes route
router.post("/recipes", recipes);

// Export the router as a module
module.exports = router;
