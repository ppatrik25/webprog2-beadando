const logout = (req, res) => {
  // Clear the userRegistered cookie
  res.clearCookie("userRegistered");

  // Redirect the user to the home page
  res.redirect("/");
};

// Export the logout function as a module
module.exports = logout;
