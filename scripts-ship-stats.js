var STATS_LIBRARY = {
    "agility": {
        "color": "#69BD45",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_Agility.png"
    },
    "hull": {
        "color": "#F6EC14",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_Hull.png"
    },
    "shields": {
        "color": "#7DD1E2",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_Shield.png"
    },
    "front arc": {
        "color": "#EE2024",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_FrontArc.png"
    },
    "rear arc": {
        "color": "#EE2024",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_RearArc.png"
    },
    "full front arc": {
        "color": "#EE2024",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_Front180.png"
    },
    "double turret arc": {
        "color": "#EE2024",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_DualMobileArc.png"
    },
    "single turret arc": {
        "color": "#EE2024",
        "imageURL": "https://sb-cdn.fantasyflightgames.com/card_stats/S_MobileArc.png"
    }
};

// ------------------------------------------------------------------
// Creates HTML for ship stats
// ------------------------------------------------------------------

function createHTMlForShipStatsJSON(shipStatsJSON) {
    var shipStatsString = JSON.stringify(shipStatsJSON).toLowerCase()
        .replace(/","value":/gi, ": ")
        .replace(/"type":"/gi, "")
        .replace(/"arc":/gi, "")
        .replace(/"/gi, "")
        .replace(/{/gi, "")
        .replace(/}/gi, "")
        .replace(/\[/gi, "")
        .replace(/]/gi, "")
        .replace(/arc,attack/gi, "arc")
        .replace(/,/gi, ", ")
        .toUpperCase();
    // Now that the stats are a single string, add color formatting, if desired
    var shipStatsHTML = createShipStatsHTMLFromStatsString(shipStatsString);
    // Return the final HTML
    return shipStatsHTML;
}

// ------------------------------------------------------------------
// Convert the string to HTML
// ------------------------------------------------------------------

function createShipStatsHTMLFromStatsString(shipStatsString) {
    // Convert this string to an HTML
    var shipStatsHTML = "";
    // Split the string by comma, and loop through each stat, and add it in turn
    var shipStatsArray = shipStatsString.split(",");
    for (var i = 0; i < shipStatsArray.length; i++) {
        // Get the stat name
        var statName = shipStatsArray[i].split(": ")[0].toLowerCase().trim();
        // Get the color and image URL for this stat
        console.log("Stat: '" + statName + "':", STATS_LIBRARY[statName]);
        var color = STATS_LIBRARY[statName].color;
        var imageURL = STATS_LIBRARY[statName].imageURL;
        // Create HTML for this ship
        var shipHTML = "<div class='shipStatClass' style='background-image: url(" + imageURL + ");" + "color:" + color + "'>" + shipStatsArray[i].split(": ")[1] + "</div>";
        // Add this HTML to the main HTML
        shipStatsHTML = shipStatsHTML + shipHTML;
    }
    return shipStatsHTML;
}