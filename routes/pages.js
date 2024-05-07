const loggedIn = require("../controllers/loggedInController");
const logout = require("../controllers/logoutController");
const recipes = require("../controllers/recipesController");
const express = require("express");

// Create a router object for defining routes
const router = express.Router();

// Define route for the home page
router.get("/", loggedIn, (req, res) => {
  // Check if user is logged in
  if (req.user) {
    // If logged in, render the home page with logged-in status and user data
    res.render("index", { status: "loggedIn", user: req.user });
  } else {
    // If not logged in, render the home page
    res.render("index", { status: "", user: "" });
  }
});

// Define route for the registration page
router.get("/register", loggedIn, (req, res) => {
  // Check if user is logged in
  if (req.user) {
    // If logged in, redirect to home page
    res.redirect("/");
  } else {
    // If not logged in, serve the register.html file from the public directory
    res.sendFile("register.html", { root: "./public/" });
  }
});

// Define route for the login page
router.get("/login", loggedIn, (req, res) => {
  // Check if user is logged in
  if (req.user) {
    // If logged in, redirect to home page
    res.redirect("/");
  } else {
    // If not logged in, serve the login.html file from the public directory
    res.sendFile("login.html", { root: "./public/" });
  }
});

// Define route for logging out
router.get("/logout", logout);

// Define route for the kitchen page
router.get("/kitchen", loggedIn, (req, res) => {
  // Check if user is logged in
  if (req.user) {
    // If logged in, serve the kitchen.html file from the public directory with user's furniture data
    res.sendFile("kitchen.html", {
      root: "./public/",
      furnitures: req.user.furnitures,
    });
  } else {
    // If not logged in, redirect to home page
    res.redirect("/");
  }
});

// Define route for the recipes page
router.get("/recipes", loggedIn, (req, res) => {
  // Check if user is logged in
  if (req.user) {
    // If logged in, serve the recipes.html file from the public directory with user's recipes data
    res.sendFile("recipes.html", { root: "./public/", recipes: req.recipes });
  } else {
    // If not logged in, redirect to home page
    res.redirect("/");
  }
});

// Define API route for retrieving user's furniture data
router.get("/api/furnitures", loggedIn, (req, res) => {
  res.json(req.user.furnitures);
});

// Define API route for retrieving user's items data
router.get("/api/items", loggedIn, (req, res) => {
  res.json(req.user.items);
});

// Define API route for retrieving all recipes data
router.get("/api/recipes", recipes, (req, res) => {
  res.json(req.recipes);
});

// Define API route for retrieving user's recipes data
router.get("/api/userRecipes", recipes, (req, res) => {
  res.json(req.user_recipes);
});

// Export the router object for use in other parts of the application
module.exports = router;
