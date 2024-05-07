// Function to load furniture data from the server
function loadFurnitureData() {
  // Send a GET request to retrieve furniture data from the server
  $.get({
    url: "/api/furnitures",
    type: "GET",
    dataType: "json",
    success: function (furnitures) {
      // Check if there is any furniture data returned from the server
      if (furnitures !== "[]") {
        // Parse the retrieved JSON data
        const furnituresData = JSON.parse(furnitures);

        // Iterate over each furniture data and create corresponding elements
        furnituresData.forEach(function (furnitureData) {
          const furniture = $("<div>")
            .addClass("furniture")
            .attr("id", furnitureData.id)
            .attr("szelesseg", furnitureData.width)
            .attr("magassag", furnitureData.height)
            .attr("style", furnitureData.css)
            .css({ "border-color": "black", filter: "opacity(100%)" })
            .appendTo("#furnitures-container");

          $("<img>")
            .attr("src", furnitureData.imgElement)
            .css({
              width: "100%",
              height: "100%",
            })
            .appendTo(furniture);

          // Make the furniture resizable and draggable
          furniture.resizable({
            handles: "n, e, s, w, ne, se, sw, nw",
            containment: "#furnitures-container",
          });
          furniture.draggable({
            containment: "#furnitures-container",
          });

          // Create furniture info for the furniture
          createFurnitureInfo(furnitureData.id);
        });
      }
    },
  });
}

// Function to load item data from the server
function loadItemData() {
  // Send a GET request to retrieve item data from the server
  $.get({
    url: "/api/items",
    type: "GET",
    dataType: "json",
    success: function (items) {
      // Check if there is any item data returned from the server
      if (items !== "[]") {
        // Parse the retrieved JSON data
        const itemData = JSON.parse(items);

        // Iterate over each furniture item
        itemData.forEach(function (furniture) {
          // Select the list where the item data will be added
          const selectedFurnitureList = $(
            `.furniture-info[data-furniture="${furniture.id}"] .selected-furniture-list`
          );

          // Iterate over each item of the furniture
          furniture.items.forEach(function (item) {
            // Check if the amount is less than the threshold and display a warning message
            if (parseInt(item.amount) < parseInt(item.threshold)) {
              $("<h5>")
                .text(
                  "Kevesebb, mint " + item.threshold + item.unit + " " + item.ingredientName + " maradt!"
                )
                .addClass("treshWarning")
                .appendTo(
                  $(`.furniture-info[data-furniture="${furniture.id}"]`)
                );
            }

            // Create a new list item
            const listItem = $("<li>").appendTo(selectedFurnitureList);

            // Add input fields for ingredient name, amount, and threshold
            $("<input>")
              .attr("type", "text")
              .attr("placeholder", "Alapanyag")
              .val(item.ingredientName)
              .appendTo(listItem);

            $("<input>")
              .attr("type", "number")
              .attr("placeholder", "Mennyiség")
              .attr("step", "0.01")
              .attr("min", "0")
              .val(item.amount)
              .appendTo(listItem);

            // Add a dropdown for unit selection
            const select = $("<select>")
              .attr("placeholder", "Mértékegység")
              .appendTo(listItem);

            $("<option>").val(item.unit).text(item.unit).appendTo(select);

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
              if (unit !== item.unit) {
                $("<option>").val(unit).text(unit).appendTo(select);
              }
            });

            $("<input>")
              .attr("type", "number")
              .attr("placeholder", "Minimum")
              .attr("step", "0.01")
              .attr("min", "0")
              .val(item.threshold)
              .appendTo(listItem);

            // Add a button to delete the row
            $("<button><i class='fa fa-trash'></i>")
              .addClass("delete-row-btn")
              .click(function () {
                $(this).parent().remove();
              })
              .appendTo(listItem);
          });
        });

        // Populate the search field with item data
        populateSearchField(itemData);
      }
    },
  });
}


// Event handler for selecting a furniture
var timeout;
$("#furnitures-container").on("mousedown", ".furniture", function (e) {
  // If the clicked furniture is not already selected
  if (!$(this).hasClass("selected")) {
    // Deselect all furniture, remove active state from furniture info,
    // and reset border color to black
    $(".furniture").css("border-color", "black");
    $(".furniture").removeClass("selected");
    $(".furniture-info").removeClass("active");
  }

  // Retrieve the ID of the clicked furniture
  const furnitureId = $(this).attr("id");
  // Activate the corresponding furniture info
  $(`.furniture-info[data-furniture="${furnitureId}"]`).addClass("active");
  // Mark the clicked furniture as selected and change its border color to red
  $(this).addClass("selected");
  $(this).css("border-color", "red");

  // Disable the "Add Item" button for a few seconds to avoid spamming
  $(".add-item-btn")
    .prop("disabled", true)
    .css("opacity", 0.5)
    .text("Töltés...");

  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(function () {
    $(".add-item-btn")
      .css("opacity", 1)
      .text("Tartalom mentése")
      .prop("disabled", false);
  }, 5000);
});

// Event handler for deselecting all furnitures when clicking on the background
$("#furnitures-container").click(function (e) {
  // If the click target is the background
  if (e.target === this) {
    // Reset border color and opacity of all furnitures, and remove their selected and active states
    $(".furniture").css({ "border-color": "black", filter: "opacity(100%)" });
    $(".furniture").removeClass("selected");
    $(".furniture-info").removeClass("active");
  }
});

// Event handler for deleting selected furnitures
$("#delete-furniture-btn").click(function () {
  // Remove selected furnitures and their corresponding info from the DOM
  $(".furniture.selected").remove();
  $(".furniture-info.active").remove();
});

// Event handler for adding a new furniture when the button is clicked.
$("#add-furniture-btn").click(function () {
  // Create a container div for the form
  $("<div>").attr("id", "form-no-click").appendTo("#kitchen");

  // Create a form to select the type of furniture to add
  $("<div>")
    .text("Milyen tárolót adjunk hozzá?")
    .attr("id", "furniture-type-form")
    .appendTo("#form-no-click");

  // Populate the form with a list of furniture types and their default attributes
  $("<ul>")
    .attr("id", "furniture-type-form-list")
    .appendTo("#furniture-type-form")
    .append('<li asset="szekreny1.png" szelesseg="125" magassag="243">Szekrény 1</li>')
    .append('<li asset="szekreny2.png" szelesseg="240" magassag="243">Szekrény 2</li>')
    .append('<li asset="szekreny3.png" szelesseg="164" magassag="243">Szekrény 3</li>')
    .append('<li asset="szekreny4.png" szelesseg="240" magassag="243">Szekrény 4</li>')
    .append('<li asset="szekreny5.png" szelesseg="240" magassag="243">Szekrény 5</li>')
    .append('<li asset="huto1.png" szelesseg="220" magassag="460">Hűtő 1</li>')
    .append('<li asset="huto2.png" szelesseg="220" magassag="460">Hűtő 2</li>')
    .append('<li asset="huto3.png" szelesseg="280" magassag="460">Hűtő 3</li>')
    .append('<li asset="huto4.png" szelesseg="220" magassag="460">Hűtő 4</li>')
    .append('<li asset="suto1.png" szelesseg="220" magassag="243">Sütő 1</li>')
    .append('<li asset="suto2.png" szelesseg="220" magassag="243">Sütő 2</li>')
    .append('<li asset="suto3.png" szelesseg="220" magassag="243">Sütő 3</li>')
    .append('<li asset="suto4.png" szelesseg="220" magassag="333">Sütő 4</li>')
    .append('<li asset="suto5.png" szelesseg="220" magassag="243">Sütő 5</li>')
    .append('<li asset="suto6.png" szelesseg="220" magassag="243">Sütő 6</li>')
    .append('<li asset="suto7.png" szelesseg="220" magassag="243">Sütő 7</li>')
    .append('<li asset="mosogato1.png" szelesseg="215" magassag="243">Mosogató 1</li>')
    .append('<li asset="mosogato2.png" szelesseg="266" magassag="243">Mosogató 2</li>')
    .append('<li asset="szekreny_csap1.png" szelesseg="280" magassag="370">Szekrény csappal 1</li>')
    .append('<li asset="szekreny_felso1.png" szelesseg="250" magassag="202">Felső szekrény 1</li>')
    .append('<li asset="szekreny_felso2.png" szelesseg="220" magassag="202">Felső szekrény 2</li>')
    .append('<li asset="szekreny_felso3.png" szelesseg="213" magassag="202">Felső szekrény 3</li>')
    .append('<li asset="szekreny_magas1.png" szelesseg="130" magassag="140">Magas szekrény 1</li>')
    .append('<li asset="szekreny_magas2.png" szelesseg="280" magassag="663">Magas szekrény 2</li>')
    .append('<li asset="szekreny_magas3.png" szelesseg="280" magassag="663">Magas szekrény 3</li>')
    .append('<li asset="polc1.png" szelesseg="250" magassag="123">Polc 1</li>')
    .append('<li asset="polc2.png" szelesseg="250" magassag="105">Polc 2</li>')
    .append('<li asset="polc3.png" szelesseg="250" magassag="80">Polc 3</li>')

  // Event handler for selecting a furniture type from the form
  $("#furniture-type-form-list li").click(function () {
    // Retrieve dimensions and image path of the selected furniture type
    furniture_width = $(this).attr("szelesseg");
    furniture_height = $(this).attr("magassag");
    img_value = "assets/" + $(this).attr("asset");
    // Remove the form container if a furniture type is selected
    $("#kitchen #form-no-click").remove();
    // Call the function to add the new furniture
    addNewFurniture();
  });

  // Create a button to cancel adding furniture
  $("<button>")
    .text("Vissza")
    .click(function () {
      // Remove the form container when button is clicked
      $("#kitchen #form-no-click").remove();
    })
    .appendTo("#furniture-type-form");
});

// Event handler for saving furniture data when the button is clicked
$("#save-furnitures-btn").click(function () {
  // Call the function to save furniture data
  saveFurnitureData();
  // Disable the button for a few seconds to avoid spamming
  $(this).prop("disabled", true).css("opacity", 0.5).text("Mentés...");

  let button = $(this);
  setTimeout(function () {
    button.css("opacity", 1).text("Elrendezés mentése").prop("disabled", false);
  }, 5000);
});

// Event handler for when the search button is clicked
$("#search-items-btn").click(function () {
  // Loop through each furniture
  $(".furniture").each(function () {
    // Reset selection and active states
    $(this).removeClass("selected");
    $(".furniture-info").removeClass("active");

    // If the furniture ID is not in the resultIDs array, reduce opacity
    if (resultIDs.indexOf($(this).attr("id")) === -1) {
      $(this).css("filter", "opacity(25%)");
    } else {
      // If the furniture ID is in the resultIDs array, "select" it
      $(this).css("border-color", "red");
    }
  });
});


// Function to add a new furniture
function addNewFurniture() {
  // Create a new furniture element
  const newFurniture = $("<div>")
    .addClass("furniture")
    .attr("id", `furniture-${Date.now()}`)
    .attr("szelesseg", furniture_width)
    .attr("magassag", furniture_height)
    .css({
      width: furniture_width,
      height: furniture_height,
    })
    .appendTo("#furnitures-container");

  // Add an image textrue to the new furniture element
  $("<img>")
    .attr("src", img_value)
    .css({
      width: "100%",
      height: "100%",
    })
    .appendTo(newFurniture);

  // Make the new furniture resizable and draggable
  newFurniture.resizable({
    handles: "n, e, s, w, ne, se, sw, nw",
    containment: "#furnitures-container",
  });
  newFurniture.draggable({
    containment: "#furnitures-container",
  });

  // Get the ID of the new furniture
  const furnitureId = newFurniture.attr("id");
  // Create furniture info for the new furniture
  createFurnitureInfo(furnitureId);
}

// Function to create furniture information section
function createFurnitureInfo(furnitureId) {
  // Create a div for furniture information
  const furnitureInfo = $("<div>")
    .addClass("furniture-info")
    .attr("data-furniture", furnitureId)
    .appendTo("#info-container");

  // Add a title to the furniture information section
  $("<h1>").addClass("content-title").text("Tartalom").appendTo(furnitureInfo);

  // Add labels for ingredient details
  $("<label>")
    .text("Alapanyag")
    .css({
      "margin-right": "9px",
      padding: "0",
      "font-size": "15px",
      width: "400px",
    })
    .appendTo(furnitureInfo);
  $("<label>")
    .text("Mennyiség")
    .css({
      "margin-right": "14px",
      padding: "0",
      "font-size": "15px",
      width: "400px",
    })
    .appendTo(furnitureInfo);
  $("<label>")
    .text("Egység")
    .css({
      "margin-right": "17px",
      padding: "0",
      "font-size": "15px",
      width: "400px",
    })
    .appendTo(furnitureInfo);
  $("<label>")
    .text("Minimum")
    .css({
      margin: "0",
      padding: "0",
      "font-size": "15px",
      width: "400px",
    })
    .appendTo(furnitureInfo);

  // Add a list for selected furniture items
  $("<ul>").addClass("selected-furniture-list").appendTo(furnitureInfo);

  // Add a button to add a new ingredient row
  $("<button>")
    .text("Alapanyag hozzáadása")
    .addClass("add-row-btn")
    .click(function () {
      // Call function to create a new ingredient row
      addIngredientRow(furnitureId);
    })
    .appendTo(furnitureInfo);

  // Add a button to save the content
  $("<button>")
    .text("Tartalom mentése")
    .addClass("add-item-btn")
    .click(function () {
      var button = $(this);

      // Remove previous warning messages
      $("h5").remove(".treshWarning");

      // Add list item and disable the button for a few seconds to avoid spamming
      addListItem();
      button.prop("disabled", true);
      button.css("opacity", 0.5);
      button.text("Mentés...");

      setTimeout(function () {
        button.css("opacity", 1);
        button.text("Tartalom mentése");
        button.prop("disabled", false);
      }, 5000);
    })
    .appendTo(furnitureInfo);
}
// Function to add a new list item
function addListItem() {
  // Array to store furniture items with their respective ingredient details
  const furnitureItems = [];
  // Save furniture layout to avoid stray item data
  saveFurnitureData();
  // Loop through each furniture item
  $(".furniture").each(function () {
    // Array to store item data for the current furniture item
    const itemDataList = [];
    const furnitureId = $(this).attr("id");

    // Loop through each selected ingredient row in the furniture info section
    $(`.furniture-info[data-furniture="${furnitureId}"] .selected-furniture-list li`
    ).each(function () {
      // Extract ingredient details from the input fields and select dropdown
      const ingredientName = $(this).find("input:eq(0)").val();
      const amount = $(this).find("input:eq(1)").val();
      const unit = $(this).find(":selected").text();
      const threshold = $(this).find("input:eq(2)").val();

      // Push the extracted details into the itemDataList array
      itemDataList.push({
        ingredientName,
        amount,
        unit,
        threshold,
      });

      // If the amount is less than the threshold, display a warning message
      if (parseInt(amount) < parseInt(threshold)) {
        $("<h5>")
          .text(
            "Kevesebb, mint " + threshold + unit + " " + ingredientName + " maradt!"
          )
          .addClass("treshWarning")
          .appendTo($(`.furniture-info[data-furniture="${furnitureId}"]`));
      }
    });

    // Push the furniture ID and its associated item data into the furnitureItems array
    furnitureItems.push({
      id: furnitureId,
      items: itemDataList,
    });
  });

  // Send the furnitureItems array to the server with a POST request
  fetch("/api/items", {
    method: "POST",
    body: JSON.stringify(furnitureItems),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// Function to add a new ingredient row to the selected furniture list
function addIngredientRow(furnitureId) {
  // Select the list where the new row will be added
  const selectedFurnitureList = $(
    `.furniture-info[data-furniture="${furnitureId}"] .selected-furniture-list`
  );

  // Create a new list item
  const listItem = $("<li>").appendTo(selectedFurnitureList);

  // Add input fields
  $("<input>")
    .attr("class", "ingredientNameInput")
    .attr("type", "text")
    .attr("placeholder", "Alapanyag")
    .appendTo(listItem);

  $("<input>")
    .attr("class", "amountInput")
    .attr("type", "number")
    .attr("step", "0.01")
    .attr("min", "0")
    .attr("placeholder", "Mennyiség")
    .appendTo(listItem);

  const select = $("<select>")
    .attr("class", "unitInput")
    .attr("placeholder", "Mértékegység")
    .appendTo(listItem);

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

  $("<input>")
    .attr("class", "thresholdInput")
    .attr("type", "number")
    .attr("step", "0.01")
    .attr("min", "0")
    .attr("placeholder", "Minimum")
    .appendTo(listItem);

  // Add a button to delete the row
  $("<button><i class='fa fa-trash'></i>")
    .addClass("delete-row-btn")
    .click(function () {
      $(this).parent().remove();
    })
    .appendTo(listItem);
}

// Function to populate the search field with unique options based on item data
function populateSearchField(itemData) {
  // Array to store unique search options
  var searchOptions = [];

  // Loop through each furniture item data
  itemData.forEach((furniture) => {
    // Loop through each item within the furniture
    furniture.items.forEach((item) => {
      // Check if the item has a non-empty ingredientName
      if (item.ingredientName !== "") {
        // Add the ingredientName to the searchOptions array
        searchOptions.push(item.ingredientName);
      }
    });
  });

  // Remove duplicate entries from searchOptions array
  searchOptions = [...new Set(searchOptions)];

  // Populate the search field with options
  searchOptions.forEach((option) => {
    $("<option>").text(option).appendTo("#search-items-field");
  });

  // Event handler for when the search field value changes
  $("#search-items-field").on("change", function () {
    // Get the selected search item
    searchItem = $(this).val();

    // Enable or disable the search button based on whether a search item is selected
    if (searchItem !== "") {
      $("#search-items-btn").css("opacity", 1).prop("disabled", false);
    } else {
      $("#search-items-btn").css("opacity", 0.5).prop("disabled", true);
    }

    // Array to store IDs of furniture items matching the search criterion
    resultIDs = [];

    // Reset furniture styles
    $(".furniture").css("border-color", "black");
    $(".furniture").css("filter", "opacity(100%)");

    // If a search item is selected, find matching items and store the containing furniture's ID
    if (searchItem !== "") {
      itemData.forEach((furniture) => {
        furniture.items.forEach((item) => {
          if (item.ingredientName === searchItem) {
            resultIDs.push(furniture.id);
          }
        });
      });
    }
  });
}
// Function to save furniture data to the server
function saveFurnitureData() {
  // Array to store furniture data
  const furnituresData = [];

  // Loop through each furniture item
  $(".furniture").each(function () {
    // Extract furniture data
    const furnitureId = $(this).attr("id");
    const furnitureData = {
      id: furnitureId,
      imgElement: $(this).find("img").attr("src"),
      css: $(this).attr("style"),
    };
    // Push furniture data into the array
    furnituresData.push(furnitureData);
  });

  // Send furnituresData to the server with a POST request
  fetch("/api/furnitures", {
    method: "POST",
    body: JSON.stringify(furnituresData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Call load functions when page loads
loadFurnitureData();
loadItemData();
