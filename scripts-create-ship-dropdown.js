// ------------------------------------------------------------------
// Get the XWS information
// ------------------------------------------------------------------

function loadXWSShipStatisticsURLsThenGetFFGDataThenPopulateDropDown() {
    // Get the XWS manifest
    $.get("https://raw.githubusercontent.com/guidokessels/xwing-data2/master/data/manifest.json", function (data, status) {
        var XWSManifestJSONString = data;
        // Split the string into lines
        var XWSManifestJSONLines = XWSManifestJSONString.split("\n");
        // Strip out everything except the ship statistics
        XWSShipStatisticsURLsArray = [];
        for (var i = 0; i < XWSManifestJSONLines.length; i++) {
            // If this line is for ship stats, add it to the array!
            if (XWSManifestJSONLines[i].indexOf("\"data/pilots/") != -1) {
                var shipStatisticsURL = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/" + (XWSManifestJSONLines[i].replace("\"", "").replace("\"", "").replace(",", "")).trim();
                XWSShipStatisticsURLsArray.push(shipStatisticsURL);
            }
        }
        console.log("Data from XWS: ", XWSShipStatisticsURLsArray);
        // Next, load the ships from FFG and populate the drop-down 
        populateDropDownWithShipNamesAndDialURLS();
        // Finally, check if we can load a squad!
        loadDialsFromURL();
    });
}

// ------------------------------------------------------------------
// Adds entries to the select
// ------------------------------------------------------------------

function populateDropDownWithShipNamesAndDialURLS() {
    //console.log("Dial URLs:", shipDialURLs);
    // Add each ship to a drop-down
    var shipSelectorDropDownElement = document.getElementById("shipSelectorDropDown");
    for (var i = 0; i < XWSShipStatisticsURLsArray.length; i++) {
        // Create a new option in the select drop-down
        var newOptionElement = document.createElement("option");
        // Set the option's text label to be a more human-readible name
        newOptionElement.textContent = createDropDownOptionTextFromXWSShipStatisticsURL(XWSShipStatisticsURLsArray[i]);
        // Set the option value to index of the array!
        newOptionElement.value = XWSShipStatisticsURLsArray[i];
        // Set the class equal to the xws ship name
        newOptionElement.className = "shipTypeOptionElement " + createXWSShipNameFromShipStatsURL(XWSShipStatisticsURLsArray[i]);
        // Add this new element to the parent
        shipSelectorDropDownElement.appendChild(newOptionElement);
    }
    // Finally, set the drop-down to be the first option
    shipSelectorDropDownElement.selectedIndex = 1;
}

// ------------------------------------------------------------------
// Create a readable and friendly name from the URL for use as the option text
// ------------------------------------------------------------------

function createDropDownOptionTextFromXWSShipStatisticsURL(XWSShipStatisticsURL) {
    var optionText = XWSShipStatisticsURL
        .replace(".json", "")
        .split("/pilots/")[1]
        .replace(new RegExp("[-]", "g"), " ")
        .replace("/", " - ");
    // Capitalize first words
    optionText = optionText.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return (optionText.split(" - ")[0] + " - " + fixShipNameCapitalization(optionText.split(" - ")[1]));
}

// ------------------------------------------------------------------
// Create an XWS ship name from the URL
// ------------------------------------------------------------------

function createXWSShipNameFromShipStatsURL(shipStatsURL) {
    return shipStatsURL.split("/").slice(-1)[0].replace(".json", "").replace(new RegExp("[-]", "g"), "");
}

// ------------------------------------------------------------------
// Create a readable and friendly name from the URL for use as the option text
// ------------------------------------------------------------------

function createDropDownOptionTextFromXWSShipStatisticsURL(XWSShipStatisticsURL) {
    var optionText = XWSShipStatisticsURL
        .replace(".json", "")
        .split("/pilots/")[1]
        .replace(new RegExp("[-]", "g"), " ")
        .replace("/", " - ");
    // Capitalize first words
    optionText = optionText.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return (optionText.split(" - ")[0] + " - " + fixShipNameCapitalization(optionText.split(" - ")[1]));
}

// ------------------------------------------------------------------
// Changes caps in certain ship names
// ------------------------------------------------------------------

function fixShipNameCapitalization(shipName) {
    var newShipName = shipName;
    newShipName = newShipName.replace(" Wing", "-wing");
    newShipName = newShipName.replace("Tie ", "TIE ");
    newShipName = newShipName.replace("Yt ", "YT ");
    newShipName = newShipName.replace("Btl ", "BTL ");
    newShipName = newShipName.replace("Rz ", "RZ ");
    newShipName = newShipName.replace("T ", "T-");
    newShipName = newShipName.replace("Vcx ", "VCX-");
    newShipName = newShipName.replace("Arc ", "ARC-");
    return newShipName;
}