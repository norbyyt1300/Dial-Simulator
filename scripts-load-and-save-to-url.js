
// ------------------------------------------------------------------
// Save squad to URL
// ------------------------------------------------------------------

function saveSquadToURL() {
    var shipElementClassName = "dialManeuversWrapperClass";
    // Get all ships
    var shipElements = document.getElementsByClassName(shipElementClassName);
    // Format the ships as JSON
    var squadJSON = {
        "pilots": []
    };
    for (var i = 0; i < shipElements.length; i++) {
        var shipType = shipElements[i].className.replace(shipElementClassName, "").trim();
        squadJSON.pilots.push({ "ship": shipType });
    }
    console.log("Squad JSON:", squadJSON);
    // If the URL search doesn't equal the new JSON, update it!
    if (window.location.search != JSON.stringify(squadJSON)) {
        window.location.search = JSON.stringify(squadJSON);
    }
}

// ------------------------------------------------------------------
// Load XWS from the from the URL
// ------------------------------------------------------------------

function loadDialsFromURL() {
    // Check if there is a squad in the URL!
    var preexistingSquadJSON = window.location.search;
    if (preexistingSquadJSON.length > 1) {
        console.log("Loading pre-existing squad JSON!");
        var cleansedJSONFromURL = preexistingSquadJSON.substring(1);
        cleansedJSONFromURL = cleansedJSONFromURL.replace(/%22/g, '"');
        cleansedJSONFromURL = cleansedJSONFromURL.replace(/%20/g, ' ');
        cleansedJSONFromURL = cleansedJSONFromURL.replace(/%0A/g, '');
        cleansedJSONFromURL = cleansedJSONFromURL.replace(/%27/g, "'");
        cleansedJSONFromURL = cleansedJSONFromURL.replace(/%2F/g, "/");
        cleansedJSONFromURL = cleansedJSONFromURL.replace(/%2D/g, "-");
        // Fix any ship abbreviations that need to be updated
        cleansedJSONFromURL = cleansedJSONFromURL.replace(/mg100starfortress/g, "mg100starfortresssf17");
        // Get dials for this saved squad!
        loadDialsFromXWS(cleansedJSONFromURL);
    } else {
        console.log("No saved squad detected.");
    }
}

// ------------------------------------------------------------------
// Now that the squad XWS has been obtained, extract the dials and add them
// ------------------------------------------------------------------

function loadDialsFromXWS(cleansedJSONFromURL) {
    // Get all of the select options
    var shipTypeOptionElements = document.getElementsByClassName("shipTypeOptionElement");
    // Convert the options into a dictionary
    var shipTypeDictionary = {};
    for (var i = 0; i < shipTypeOptionElements.length; i++) {
        var shipType_inShipDictionary = createXWSShipNameFromShipStatsURL(shipTypeOptionElements[i].value);
        shipTypeDictionary[shipType_inShipDictionary] = shipTypeOptionElements[i].value;
    }
    console.log("Ship type dictionary:", shipTypeDictionary);
    var squadJSONFromURL = JSON.parse(cleansedJSONFromURL);
    console.log("Adding dials from XWS in URL:", squadJSONFromURL);
    for (var j = 0; j < squadJSONFromURL.pilots.length; j++) {
        var shipType = squadJSONFromURL.pilots[j].ship;
        console.log("Adding dial for ship of type: " + shipType);
        // Find which option was selected
        var selectedOptionValue_shipStatsURL = shipTypeDictionary[shipType];
        if (selectedOptionValue_shipStatsURL) {
            var selectedOptionText_shipName = createDropDownOptionTextFromXWSShipStatisticsURL(selectedOptionValue_shipStatsURL);
            // Add a dial given this text and value
            loadDialUsingShipNameAndURL(selectedOptionText_shipName, selectedOptionValue_shipStatsURL);
        }
    }
    // Actually, at the end, just hide the selector and buttons to add ships or save ships
    console.log("Now hiding selectors...");
    document.getElementById("shipSelectorDropDown").style.display = "none";
    document.getElementById("loadShipsButton").style.display = "none";
    document.getElementById("saveToURLButton").style.display = "none";
    document.getElementById("main-top-nav-bar").style.display = "none";
}