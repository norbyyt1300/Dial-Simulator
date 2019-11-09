// Constants
var shipCounter = 1;
var useTouchDragInsteadOfMouseDrag = true;
var XWSShipStatisticsURLsArray = null;
// An array containing the ship names and URLs and statistics
var shipInformationArray = [];
// Indeces for easily accesing information in the array
var INDEX_SHIP_FRIENDLY_NAME = 0;
var INDEX_SHIP_DIAL_URL = 1;
var INDEX_SHIP_STATS_URL = 2;

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

// Onload
function myOnloadFunction() {
    // Check if touch vs mouse
    useTouchDragInsteadOfMouseDrag = ('ontouchstart' in document.documentElement);
    console.log("Using touch instead of mouse: " + useTouchDragInsteadOfMouseDrag);
    // Get ships from XWS, FFG, and make the dropdown        
    loadXWSShipStatisticsURLsThenGetFFGDataThenPopulateDropDown();
}

// Get the XWS information
function loadXWSShipStatisticsURLsThenGetFFGDataThenPopulateDropDown() {
    // Get the XWS manifest
    $.get("https://raw.githubusercontent.com/guidokessels/xwing-data2/master/data/manifest.json", function(data, status){
        var XWSManifestJSONString = data;
        // Split the string into lines
        var XWSManifestJSONLines = XWSManifestJSONString.split("\n");
        // Strip out everything except the ship statistics
        XWSShipStatisticsURLsArray = [];
        for (var i = 0; i < XWSManifestJSONLines.length; i++) {
            // If this line is for ship stats, add it to the array!
            if (XWSManifestJSONLines[i].indexOf("\"data/pilots/") != -1) {
                var shipStatisticsURL = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/" + (XWSManifestJSONLines[i].replace("\"","").replace("\"","").replace(",","")).trim();
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

// Adds entries to the select
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

// Load from URL
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
        // Get dials for this saved squad!
        loadDialsFromXWS(cleansedJSONFromURL);
    } else {
        console.log("No saved squad detected.");
    }
}

// Create an XWS ship name from the URL
function createXWSShipNameFromShipStatsURL(shipStatsURL) {
    return shipStatsURL.split("/").slice(-1)[0].replace(".json", "").replace(new RegExp("[-]", "g"), "");
}

// Create a readable and friendly name from the URL for use as the option text
function createDropDownOptionTextFromXWSShipStatisticsURL(XWSShipStatisticsURL) {
    var optionText = XWSShipStatisticsURL
        .replace(".json", "")
        .split("/pilots/")[1]
        .replace(new RegExp("[-]", "g"), " ")
        .replace("/", " - ");
    // Capitalize first words
    optionText = optionText.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return (optionText.split(" - ")[0] + " - " + fixShipNameCapitalization(optionText.split(" - ")[1]));
}


// Changes caps in certain ship names
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

// Determine which dial was clicked, and add it
function loadDial() {
    // Get the drop-down element
    var shipSelectorDropDownElement = document.getElementById("shipSelectorDropDown"); 
    // Find which option was selected
    var selectedOptionText_shipName = shipSelectorDropDownElement.options[shipSelectorDropDownElement.selectedIndex].text;
    var selectedOptionValue_shipStatsURL = shipSelectorDropDownElement.options[shipSelectorDropDownElement.selectedIndex].value;
    // Add a dial given this text and value
    loadDialUsingShipNameAndURL(selectedOptionText_shipName, selectedOptionValue_shipStatsURL);
}

// Load the dial image from FFG, and add a new DIV for this dial to the page
function loadDialUsingShipNameAndURL(selectedOptionText_shipName, selectedOptionValue_shipStatsURL) {
    // Get the dials container
    var dialsContainerElement = document.getElementById("dialsContainer");
    // Add a new dial wrapper as a new element, and set its class
    var newDialWrapperElement = document.createElement("div");
    newDialWrapperElement.setAttribute('class', "dialWrapperClass");
    // Add the label element, and set its class
    var newDialLabelElement = document.createElement("div");
    newDialLabelElement.setAttribute('class', "dialLabelClass");
    // Set the label text
    //newDialLabelElement.innerHTML = "Ship #" + shipCounter + ": " + shipSelectorDropDownElement.options[shipSelectorDropDownElement.selectedIndex].text.split(" - ")[1] + "<div onclick='flipDial(this)' class='flip-dial-button'><b>&#8634;</b></div>";
    newDialLabelElement.innerHTML = "<div class='dialLabelClassInnerElement'><b>#" + shipCounter + ": </b>" + selectedOptionText_shipName.split(" - ")[1] + "<div onclick='flipDial(this)' class='flip-dial-button'><b>&#8634;</b></div></div>";
    // Allow scrolling to this dial when the title is clicked
    newDialLabelElement.addEventListener("click", function() {
        console.log("Label clicked: Position: ", this.getBoundingClientRect().top);
        this.scrollIntoView(true);
    });
    // Increment the ship counter
    shipCounter++;
    var shipStatsURL = selectedOptionValue_shipStatsURL;
    console.log("Ship stats URL:");
    console.log(shipStatsURL);
    // Add the draggable element
    var maneuverSelectorElement = document.createElement("div");
    // Set the class
    maneuverSelectorElement.setAttribute('class', "maneuverSelectorClass");
    // Add all these new elements to their parent element
    dialsContainerElement.appendChild(newDialWrapperElement);
    newDialWrapperElement.appendChild(maneuverSelectorElement);
    newDialWrapperElement.appendChild(newDialLabelElement);
    // Shift the selector element
    maneuverSelectorElement.style.left = parseInt(maneuverSelectorElement.style.left.replace("px", ""), 10) + 308 + "px";
    // Make the maneuver selector element draggable:
    if (useTouchDragInsteadOfMouseDrag) {
        // From https://mobiforge.com/design-development/touch-friendly-drag-and-drop
        maneuverSelectorElement.addEventListener('touchmove', function(event) {
            // Get the touch event
            var touch = event.targetTouches[0];
            var touchOffsetInPx = 25;
            // Place element where the finger is, minus an offset
            maneuverSelectorElement.style.left = touch.pageX - touchOffsetInPx + 'px';
            maneuverSelectorElement.style.top = touch.pageY - touchOffsetInPx + 'px';
            event.preventDefault();
        }, false);
    } else {
        // Otherwise, add draggability in response to mouse events
        addMouseDraggability(maneuverSelectorElement);
        // Also add inline styling to fit more dials on one page
        newDialWrapperElement.style.cssFloat = "left";
        newDialWrapperElement.style.marginRight = "10px";                
    }
    // Add the dial
    console.log("Add the ship dial");
    var maneuversWrapperElement = document.createElement("div");
    maneuversWrapperElement.setAttribute('class', ("dialManeuversWrapperClass"));
    // Add this element to the parent
    newDialWrapperElement.appendChild(maneuversWrapperElement);    
    $.get(shipStatsURL, function(data, status) {
        var parsedShipJSON = JSON.parse(data);
        var shipStatsJSON = parsedShipJSON.stats;
        console.log("Ship JSON: ", shipStatsJSON);
        console.log("Ship dial JSON: ", parsedShipJSON.dial);
        // Get the ship name
        var XWSShipName = parsedShipJSON.xws;
        console.log("XWS Ship Name: ", XWSShipName);
        // Update the parent class with the ship name
        maneuversWrapperElement.setAttribute('class', ("dialManeuversWrapperClass " + XWSShipName));
        //var maneuversArray = parsedShipJSON.dial.reverse();
        var maneuversArray = parsedShipJSON.dial;
        var previousManeuverSpeed = maneuversArray[0].substring(0,1);
        for (var i = 0; i < maneuversArray.length; i++) {
            var maneuverString = maneuversArray[i];
            var maneuverSpeed = maneuverString.substring(0,1);
            var maneuverDirection = maneuverString.substring(1,2);
            var maneuverColor = maneuverString.substring(2);
            console.log("Speed, direction, and color: ", maneuverSpeed + "," + maneuverDirection + "," + maneuverColor);
            var newDialManeuverElement = document.createElement("div");
            // If this maneuver speed is different from the previous maneuver's speed, add a line break
            if (previousManeuverSpeed != maneuverSpeed) {
                //newDialWrapperElement.appendChild(document.createElement("br"));
            }
            previousManeuverSpeed = maneuverSpeed;
            newDialManeuverElement.innerHTML = "<i class='dialManeuverSymbolClass maneuverColor" + maneuverColor + " xwing-miniatures-font " + getManeuverDirectionSymbol(maneuverDirection) + "'></i><div class='dialManeuverSpeedClass'>" + maneuverSpeed + "</div>";
            newDialManeuverElement.setAttribute('class', "dialManeuverElementWrapperClass");
            maneuversWrapperElement.appendChild(newDialManeuverElement);
        }
        // Arrange these in a circle
        // Courtesy of https://codepen.io/dbpas/pen/LGudb
        var type = 1, //circle type - 1 whole, 0.5 half, 0.25 quarter
            radius = '7em', //distance from center
            start = -90, //shift start from 0
            $elements = $(maneuversWrapperElement).children(),
            numberOfElements = (type === 1) ?  $elements.length : $elements.length - 1, //adj for even distro of elements when not full circle
            slice = 360 * type / numberOfElements;
        $elements.each(function(i) {
            var $self = $(this),
                rotate = slice * i + start,
                rotateReverse = rotate * -1;
            $self.css({
                //'transform': 'rotate(' + rotate + 'deg) translate(' + radius + ') rotate(' + rotateReverse + 'deg)'
                'transform': 'rotate(' + rotate + 'deg) translate(' + radius + ') rotate(90deg)',
                'top': maneuversWrapperElement.offsetTop + 125,
                'left': maneuversWrapperElement.offsetLeft + 150
            });
        });
        // Add the outer and inner circles for the dial
        var dialInnerCircle = document.createElement("div");
        var dialOuterCircle = document.createElement("div");
        dialInnerCircle.setAttribute('class', "innerCircleDiv");
        dialOuterCircle.setAttribute('class', "outerCircleDiv");
        maneuversWrapperElement.appendChild(dialInnerCircle);
        maneuversWrapperElement.appendChild(dialOuterCircle);
        // Add the ship stats
        console.log("Add the ship stats");
        var newShipStatsElement = document.createElement("div");
        newShipStatsElement.innerHTML = createHTMlForShipStatsJSON(shipStatsJSON);   
        newShipStatsElement.setAttribute('class', "shipStatsClass");
        newDialWrapperElement.appendChild(newShipStatsElement);
    }); 
}

function getManeuverDirectionSymbol(maneuverDirectionCharacter) {
    var maneuverDirectionSymbolClass = "";
    switch (maneuverDirectionCharacter) {
        case "T":
            //turnleft;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-turnleft";
            break;
        case "Y":
            //turn right;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-turnright";
            break;
        case "B":
            //bankleft;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-bankleft";
            break;
        case "N":
            //bank right;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-bankright";
            break;
        case "F":
            //straight;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-straight";
            break;
        case "K":
            //kturn;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-kturn";
            break;
        case "R":
            //tallonright;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-trollright";
            break;
        case "E":
            //tallonleft;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-trollleft";
            break;
        case "L":
            //sloop left;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-sloopleft";
            break;
        case "P":
            //sloop right;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-sloopright";
            break;
        case "A":
            //rev bank left
            maneuverDirectionSymbolClass = "xwing-miniatures-font-reversebankleft";
            break;
        case "D":
            //rev bank right
            maneuverDirectionSymbolClass = "xwing-miniatures-font-reversebankright";
            break;
        case "S":
            //reverse straight;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-reversestraight";
            break;
        case "O":
            //stop;
            maneuverDirectionSymbolClass = "xwing-miniatures-font-stop";
            break;                                                                                                                                                                                   
    }
    return maneuverDirectionSymbolClass;
}

// Creates HTML for ship stats
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

// Convert the string to HTML
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
}

// ------------------------------------------------------------------
// Code for enabling dragging
// Courtesy of https://www.w3schools.com/howto/howto_js_draggable.asp
// ------------------------------------------------------------------

function addMouseDraggability(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        // Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Function that hides a dial selector
function flipDial(clickedElement) {
    // Get the ship element
    var shipElement = clickedElement.parentElement.parentElement.parentElement;
    // Get the selector
    var selectorElement = shipElement.getElementsByClassName('maneuverSelectorClass')[0];
    // Also get the dial image
    //var dialImageElement = shipElement.getElementsByClassName('dialImageClass')[0];
    //console.log(selectorElement);
    if (selectorElement.style.visibility == "hidden") {
        selectorElement.style.visibility = "visible";
        clickedElement.style.color = "lime";
        //dialImageElement.style.opacity = "1";
    } else {
        selectorElement.style.visibility = "hidden";
        clickedElement.style.color = "red";
        //dialImageElement.style.opacity = "0.1";
    }
}

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
        squadJSON.pilots.push({"ship": shipType});
    }
    console.log("Squad JSON:", squadJSON);
    // If the URL search doesn't equal the new JSON, update it!
    if (window.location.search != JSON.stringify(squadJSON)) {
        window.location.search = JSON.stringify(squadJSON);
    }
}