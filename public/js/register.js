// Event listener for the register button
form.addEventListener("submit", () => {
  // Creating an object to hold the registration credentials
  const register = {
    email: email.value,
    password: password.value,
  };

  // Sending a POST request to the /api/register endpoint with the registration credentials
  fetch("/api/register", {
    // Specifying the request method as POST
    method: "POST",
    // Converting the register object to JSON and setting it as the request body
    body: JSON.stringify(register),
    // Setting the Content-Type header to application/json to indicate JSON data
    headers: {
      "Content-Type": "application/json",
    },
  })
    // Handling the response from the server
    .then((res) => res.json())
    // Parsing the JSON response from the server
    .then((data) => {
      // Checking if the response status is an error
      if (data.status == "error") {
        // Hiding the success message element
        success.style.display = "none";
        // Displaying the error message element
        error.style.display = "block";
        // Setting the error message text to the error message from the server
        error.innerText = data.error;
      }
      // If the response status is not an error
      else {
        // Displaying the success message element
        success.style.display = "block";
        // Hiding the error message element
        error.style.display = "none";
        // Setting the success message text to the success message from the server
        success.innerText = data.success;
      }
    });
});
