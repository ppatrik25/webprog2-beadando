const express = require("express");
const db = require("./routes/db-config");
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 5000;

const app = express(); // Create an instance of the Express application

// Serve static files from the public directory
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/assets", express.static(__dirname + "/public/assets"));

// Set the view engine to EJS and specify the views directory
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cookie()); // Use cookie parser middleware
app.use(express.json()); // Parse incoming requests with JSON payloads

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// Define routes for handling different pages
app.use("/", require("./routes/pages"));
// Define routes for handling authentication-related API endpoints (controllers)
app.use("/api", require("./controllers/auth"));

// Start the server and listen on the specified port
app.listen(PORT);

// Middleware to handle 404 errors by redirecting to the home page
app.use((req, res, next) => {
  res.status(404).redirect("/");
});
