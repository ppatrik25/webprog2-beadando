/* BOX 1 */

// Create recipe title input field
const recipeTitle = $("<input>")
  .attr("type", "text")
  .attr("spellcheck", "false")
  .attr("placeholder", "Cím")
  .addClass("recipe-title")
  .appendTo(".box1");

// Create container for recipe information
const recipeInfo = $("<div>").addClass("recipe-info").appendTo(".box1");

// Create ingredient list
$("<ul>").addClass("ingredient-list").appendTo(recipeInfo);

// Add initial ingredient row
addIngredientRow();

// Add button to add new ingredient row
$("<button>")
  .text("Alapanyag hozzáadása")
  .addClass("add-row-btn")
  .click(function () {
    addIngredientRow();
  })
  .appendTo(recipeInfo);

// Create container for recipe description
const recipeDescription = $("<div>").addClass("recipe-desc").appendTo(".box1");

// Create textarea for recipe description
$("<textarea>")
  .attr("spellcheck", "false")
  .attr("placeholder", "Leírás")
  .appendTo(recipeDescription);

// Add button to save recipe content
$("<button>")
  .text("Tartalom mentése")
  .addClass("add-item-btn")
  .click(function () {
    addRecipe();
  })
  .prop("disabled", true)
  .css("opacity", 0.5)
  .text("Töltés...")
  .appendTo(".box1");

// Allow clicking after a few seconds to avoid spamming
setTimeout(function () {
  $(".add-item-btn").css("opacity", 1);
  $(".add-item-btn").text("Tartalom mentése");
  $(".add-item-btn").prop("disabled", false);
}, 5000);

// Function to add a new ingredient row
function addIngredientRow() {
  const ingredientList = $(".ingredient-list");
  const listItem = $("<li>").appendTo(ingredientList);

  // Input field for ingredient name
  $("<input>")
    .attr("class", "ingredientNameInput")
    .attr("type", "text")
    .attr("placeholder", "Alapanyag")
    .appendTo(listItem);

  // Input field for amount
  $("<input>")
    .attr("class", "amountInput")
    .attr("type", "number")
    .attr("step", "0.01")
    .attr("min", "0")
    .attr("placeholder", "Mennyiség")
    .appendTo(listItem);

  // Dropdown for unit selection
  const select = $("<select>")
    .attr("class", "unitInput")
    .attr("placeholder", "Mértékegység")
    .appendTo(listItem);

  // Add options for units
  const units = [
    "db",
    "mk",
    "kk",
    "tk",
    "ek",
    "pohár",
    "gerezd",
    "púpozott ek",
    "csapott ek",
    "késhegynyi",
    "g",
    "dkg",
    "kg",
    "dl",
    "cl",
    "ml",
    "l",
    "csepp",
    "",
  ];

  units.forEach((unit) => {
    $("<option>").text(unit).appendTo(select);
  });

  // Button to delete the row
  $("<button><i class='fa fa-trash'></i>")
    .addClass("delete-row-btn")
    .click(function () {
      $(this).parent().remove();
    })
    .appendTo(listItem);
}

// Function to save recipe to the server
function addRecipe() {
  // Remove any existing error messages
  $("#recipe-title-error").remove();
  $("#recipe-desc-error").remove();

  // Initialize an array to store recipe data
  const recipeDataList = [];

  // Retrieve recipe title and description
  const recipeTitle = $(".recipe-title").val();
  const recipeDesc = $(".recipe-desc textarea").val();

  // Validate recipe title and description
  if (recipeTitle.trim().length === 0) {
    // Display error message if title is empty
    $(".recipe-title").after(
      $("<h6>")
        .text("Cím megadása kötelező!")
        .css({
          color: "red",
          margin: "0px",
          "margin-bottom": "10px",
          "font-family": "Arial, Helvetica, sans-serif",
          "letter-spacing": "0px",
        })
        .attr("id", "recipe-title-error")
    );
  } else if (recipeDesc.trim().length === 0) {
    // Display error message if description is empty
    $(".recipe-desc").after(
      $("<h6>")
        .text("Leírás megadása kötelező!")
        .css({
          color: "red",
          margin: "0px",
          "margin-bottom": "10px",
          "font-family": "Arial, Helvetica, sans-serif",
          "letter-spacing": "0px",
        })
        .attr("id", "recipe-desc-error")
    );
  } else {
    // Iterate over each ingredient in the list and add it to the recipe data array
    $(".ingredient-list li").each(function () {
      const ingredientName = $(this).find("input:eq(0)").val();
      const amount = $(this).find("input:eq(1)").val();
      const unit = $(this).find(":selected").text();

      recipeDataList.push({
        ingredientName,
        amount,
        unit,
      });
    });

    // Create recipe object with title, ingredients and description
    const recipe = {
      title: recipeTitle,
      ingredients: JSON.stringify(recipeDataList),
      description: recipeDesc
    };

    // Send a POST request to the server to save the recipe data
    fetch("/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Reload the page to reflect the changes
    location.reload();
  }
}

/* BOX 2 */

// Create radio button for displaying all recipes
$("<input>")
  .attr("type", "radio")
  .attr("id", "allRecipes")
  .attr("name", "box2Radio")
  .attr("checked", "checked")
  .change(function () {
    $("#recipesList").empty();
    loadAllRecipes();
  })
  .appendTo("#radioButtons");

// Label for the allRecipes radio button
$("<label>")
  .text("Minden recept")
  .attr("for", "allRecipes")
  .appendTo("#radioButtons");

// Create radio button for displaying user's recipes
$("<input>")
  .attr("type", "radio")
  .attr("id", "userRecipes")
  .attr("name", "box2Radio")
  .change(function () {
    $("#recipesList").empty();
    loadUserRecipes();
  })
  .appendTo("#radioButtons");

// Label for the userRecipes radio button
$("<label>")
  .text("Saját receptek")
  .attr("for", "userRecipes")
  .appendTo("#radioButtons");

// Function to load user's recipes
function loadUserRecipes() {
  // Request user's recipes from the server
  $.get({
    url: "/api/userRecipes",
    type: "GET",
    dataType: "json",
    success: function (userRecipes) {
      const recipeTitles = [];

      // Extract recipe titles and IDs from the user's recipes
      userRecipes.forEach(function (recipe) {
        recipeTitles.push({
          id: recipe.id,
          title: recipe.title,
        });
      });

      // Display recipe titles in the recipes list
      recipeTitles.forEach(function (recipeTitle) {
        $("<li>")
          .text(recipeTitle.title)
          .addClass("recipeListItem")
          .attr("recipeId", recipeTitle.id)
          .appendTo("#recipesList");
      });

      // Add click event handler to each recipe list item to open the recipe details
      $(".recipeListItem").on("click", function () {
        openRecipe($(this).attr("recipeId"), userRecipes);
      });
    },
  });
}

// Function to load all recipes
function loadAllRecipes() {
  // Request all recipes from the server
  $.get({
    url: "/api/recipes",
    type: "GET",
    dataType: "json",
    success: function (allRecipes) {
      const recipeTitles = [];

      // Extract recipe titles and IDs from all recipes
      allRecipes.forEach(function (recipe) {
        recipeTitles.push({
          id: recipe.id,
          title: recipe.title,
        });
      });

      // Display recipe titles in the recipes list
      recipeTitles.forEach(function (recipeTitle) {
        $("<li>")
          .text(recipeTitle.title)
          .addClass("recipeListItem")
          .attr("recipeId", recipeTitle.id)
          .appendTo("#recipesList");
      });

      // Add click event handler to each recipe list item to open the recipe details
      $(".recipeListItem").on("click", function () {
        openRecipe($(this).attr("recipeId"), allRecipes);
      });
    },
  });
}

// Function to display selected recipe details
function openRecipe(recipeId, recipes) {
  const recipeTitles = [];

  // Extract recipe titles and IDs from the provided recipes
  recipes.forEach(function (recipe) {
    recipeTitles.push({
      id: recipe.id,
      title: recipe.title,
    });
  });

  // Create a container for the recipe details
  $("<div>").attr("id", "recipe-list-no-click").appendTo("#recipes");

  $("<div>").attr("id", "recipe-list").appendTo("#recipe-list-no-click");

  // Display the title of the selected recipe
  $("<h3>")
    .text(recipeTitles.find((key) => key.id == recipeId).title + " receptje")
    .css("margin-bottom", "0px")
    .appendTo("#recipe-list");

  // Create a container for displaying ingredients
  $("<div>")
    .text("Alapanyagok")
    .attr("id", "recipeIngredientsContainer")
    .css("text-align", "left")
    .css("padding", "20px")
    .appendTo("#recipe-list");

  $("<ul>")
    .attr("id", "recipeIngredientsList")
    .appendTo("#recipeIngredientsContainer");

  // Retrieve and display the ingredients of the selected recipe
  const ingredients = JSON.parse(
    recipes.find((key) => key.id == recipeId).ingredients
  );

  ingredients.forEach(function (ingredient) {
    $("<li>")
      .text(ingredient.amount + " " + ingredient.unit + " " + ingredient.ingredientName)
      .appendTo("#recipeIngredientsList");
  });

  // Create a container for displaying the recipe description
  $("<div>")
    .text("Leírás")
    .attr("id", "recipeDescriptionContainer")
    .appendTo("#recipe-list");

  $("<ul>")
    .attr("id", "recipeDescriptionList")
    .appendTo("#recipeDescriptionContainer");

  // Display the description of the selected recipe
  $("<li>")
    .text(recipes.find((key) => key.id == recipeId).description)
    .appendTo("#recipeDescriptionList");

  // Create a button to go back to the list of recipes
  $("<button>")
    .text("Vissza")
    .attr("id", "back-btn")
    .click(function () {
      $("#recipe-list").remove();
      $("#recipe-list-no-click").remove();
    })
    .appendTo("#recipe-list");
}

/* BOX 3 */

// Function to populate the search ingredients field dropdown
function populateIngredientsList() {
  // Request all recipes from the server
  $.get({
    url: "/api/recipes",
    type: "GET",
    dataType: "json",
    success: function (recipes) {
      var ingredients = [];
      var chosenIngredients = [];

      // Iterate over each recipe
      recipes.forEach(function (recipe) {
        const recipeIngredients = JSON.parse(recipe.ingredients);

        // Iterate over each ingredient in the recipe
        recipeIngredients.forEach(function (ingredient) {
          // Check if ingredient name is not empty and not already in the list of ingredients
          if (
            ingredient.ingredientName != "" &&
            ingredients.indexOf(ingredient.ingredientName) == -1
          ) 
          // Push to ingredients array if valid
          {
            ingredients.push(ingredient.ingredientName);
          }
        });
      });

      // Sort the list of ingredients alphabetically
      ingredients.sort();

      // Populate the search ingredients field dropdown with sorted ingredients
      ingredients.forEach((ingredient) => {
        $("<option>").text(ingredient).appendTo("#search-ingredients-field");
      });

      // Event handler for changes in the search ingredients field
      $("#search-ingredients-field").on("change", function () {
        ingredientName = $(this).val();

        if (ingredientName != "") {
          // Add selected ingredient to the chosen ingredients list
          chosenIngredients.push(ingredientName);
          chosenIngredients.sort();

          // Remove selected ingredient from the list of ingredients
          ingredients = ingredients
            .filter((element) => element !== ingredientName)
            .sort();

          // Clear and repopulate the search ingredients field dropdown
          $("#search-ingredients-field").empty();
          $("<option>").text("").appendTo("#search-ingredients-field");

          ingredients.forEach((ingredient) => {
            $("<option>")
              .text(ingredient)
              .appendTo("#search-ingredients-field");
          });

          // Clear and populate the selected ingredients list
          $("#selected-ingredients").empty();
          chosenIngredients.forEach((ingredient) => {
            $("<li>")
              .text(ingredient)
              .attr("class", "selected-ingredient")
              .appendTo("#selected-ingredients");
          });

          // Event handler for removing selected ingredient from the chosen ingredients list
          $(".selected-ingredient").on("click", function () {
            ingredientName = $(this).text();

            // Add removed ingredient back to the list of ingredients
            ingredients.push(ingredientName);
            ingredients.sort();

            // Remove ingredient from the chosen ingredients list
            chosenIngredients = chosenIngredients
              .filter((element) => element !== ingredientName)
              .sort();

            $(this).remove();
            $("#search-ingredients-field").empty();

            $("<option>").text("").appendTo("#search-ingredients-field");

            ingredients.forEach((ingredient) => {
              $("<option>")
                .text(ingredient)
                .appendTo("#search-ingredients-field");
            });
            // (re)Populate recipe results based on selected ingredients
            populateRecipeResults();
          });
        }
        // (re)Populate recipe results based on selected ingredients
        populateRecipeResults();
      });

      // Function to populate recipe results based on selected ingredients
      function populateRecipeResults() {
        let recipeResults = [];

        // Iterate through each recipe and add ingredients to recipeIngredients array
        recipes.forEach((recipe) => {
          let recipeIngredients = [];
          let recipeIngredientsArray = JSON.parse(recipe.ingredients);

          recipeIngredientsArray.forEach((ingredient) => {
            recipeIngredients.push(ingredient.ingredientName);
          });

          // Check if all chosen ingredients are included in the recipeIngredients
          if (chosenIngredients.every((ingredient) => recipeIngredients.includes(ingredient)) && chosenIngredients.length != 0) {
            // Add recipe to recipeResults array if all chosen ingredients are included in the recipeIngredients
            recipeResults.push(recipe);
          }
        });

        // Clear existing recipe results element
        $("#recipe-results").empty();

        // Populate recipe results list
        recipeResults.forEach(function (recipe) {
          $("<li>")
            .text(recipe.title)
            .addClass("recipeResult")
            .attr("recipeId", recipe.id)
            .appendTo("#recipe-results");
        });

        // Event handler for clicking on a recipe result
        $(".recipeResult").on("click", function () {
          openRecipe($(this).attr("recipeId"), recipes);
        });
      }
    },
  });
}

// Call load functions when page loads
loadAllRecipes();
populateIngredientsList();
