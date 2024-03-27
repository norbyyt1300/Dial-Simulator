// ------------------------------------------------------------------
// Determine which dial was clicked, and add it
// ------------------------------------------------------------------

function loadDial() {
    // Get the drop-down element
    var shipSelectorDropDownElement = document.getElementById("shipSelectorDropDown");
    // Find which option was selected
    var selectedOptionText_shipName = shipSelectorDropDownElement.options[shipSelectorDropDownElement.selectedIndex].text;
    var selectedOptionValue_shipStatsURL = shipSelectorDropDownElement.options[shipSelectorDropDownElement.selectedIndex].value;
    // Add a dial given this text and value
    loadDialUsingShipNameAndURL(selectedOptionText_shipName, selectedOptionValue_shipStatsURL);
}

// ------------------------------------------------------------------
// Load the dial image from FFG, and add a new DIV for this dial to the page
// ------------------------------------------------------------------

function loadDialUsingShipNameAndURL(selectedOptionText_shipName, selectedOptionValue_shipStatsURL) {
    // Get the dials container element that holds all the dials
    var dialsContainerElement = document.getElementById("dialsContainer");
    // Create a new wrapper element for this new single dial, set its class, and add it to its parent
    var newDialWrapperElement = document.createElement("div");
    newDialWrapperElement.setAttribute('class', "dialWrapperClass");
    dialsContainerElement.appendChild(newDialWrapperElement);
    
    
    /*
    // No longer needed; now allows directly selecting maneuver
    
    // Create the maneuver selector element, set its class, and add it to its parent
    addManeuverSelectorElement(newDialWrapperElement);
    // If using a mouse (on a desktop/laptop), float the dials left so they arrange horizontally
    if (!useTouchDragInsteadOfMouseDrag) {
        newDialWrapperElement.style.cssFloat = "left";
        newDialWrapperElement.style.marginRight = "10px";
    }



    */





    // Increment the ship counter
    shipCounter++;
    // Create the dial label element, set its class, and add it to its parent
    newDialWrapperElement.appendChild(createDialLabelElement(shipCounter, selectedOptionText_shipName));
    // Create the dial maneuvers wrapper element, set its class, and add it to its parent
    console.log("Add the ship dial maneuvers");
    var maneuversWrapperElement = document.createElement("div");
    maneuversWrapperElement.setAttribute('class', "dialManeuversWrapperClass");
    newDialWrapperElement.appendChild(maneuversWrapperElement);
    // Get the ship stats
    console.log("Getting ship dial maneuvers and stats from URL:", selectedOptionValue_shipStatsURL);
    $.get(selectedOptionValue_shipStatsURL, function (data, status) {
        var parsedShipJSON = JSON.parse(data);
        // Update the maneuvers wrapper element class with the ship name
        console.log("XWS Ship Name: ", parsedShipJSON.xws);
        maneuversWrapperElement.setAttribute('class', ("dialManeuversWrapperClass " + parsedShipJSON.xws));
        // Get the dial maneuvers and add each as an element to the maneuvers wrapper element
        createHTMLElementsForEachManeuver(parsedShipJSON.dial, maneuversWrapperElement);
        // Arrange the dial maneuver HTML elements in a circle within the maneuvers wrapper element
        arrangeDialManeuverHTMLElementsInACircle(maneuversWrapperElement);
        // Add the outer and inner circles for the dial to the maneuvers wrapper element
        addInnerAndOuterDialCircle(maneuversWrapperElement);
        // Add the ship stats
        console.log("Add the ship stats using the following JSON:", parsedShipJSON.stats);
        var newShipStatsElement = document.createElement("div");
        newShipStatsElement.innerHTML = createHTMlForShipStatsJSON(parsedShipJSON.stats);
        newShipStatsElement.setAttribute('class', "shipStatsClass");
        newDialWrapperElement.appendChild(newShipStatsElement);
    });
}

// ------------------------------------------------------------------
// Add the maneuver selector element
// ------------------------------------------------------------------

function addManeuverSelectorElement(newDialWrapperElement) {
    var maneuverSelectorElement = document.createElement("div");
    maneuverSelectorElement.setAttribute('class', "maneuverSelectorClass");
    newDialWrapperElement.appendChild(maneuverSelectorElement);
    // Make the maneuver selector element draggable for both touch and mouse
    if (useTouchDragInsteadOfMouseDrag) {
        addTouchDraggability(maneuverSelectorElement);
    } else {
        addMouseDraggability(maneuverSelectorElement);
    }
}

// ------------------------------------------------------------------
// Create HTML elements for each maneuver on the dial
// ------------------------------------------------------------------

function createHTMLElementsForEachManeuver(maneuversArray, maneuversWrapperElement) {
    console.log("Ship dial maneuvers JSON: ", maneuversArray);
    var previousManeuverSpeed = maneuversArray[0].substring(0, 1);
    for (var i = 0; i < maneuversArray.length; i++) {
        var maneuverString = maneuversArray[i];
        var maneuverSpeed = maneuverString.substring(0, 1);
        var maneuverDirection = maneuverString.substring(1, 2);
        var maneuverColor = maneuverString.substring(2);
        console.log("Maneuver speed, direction, and color: ", maneuverSpeed + "," + maneuverDirection + "," + maneuverColor);
        var newDialManeuverElement = document.createElement("div");
        /*
        // If this maneuver speed is different from the previous maneuver's speed, add a line break
        if (previousManeuverSpeed != maneuverSpeed) {
            //newDialWrapperElement.appendChild(document.createElement("br"));
        }
        */
        previousManeuverSpeed = maneuverSpeed;
        newDialManeuverElement.innerHTML = "<i class='dialManeuverSymbolClass maneuverColor" + maneuverColor + " xwing-miniatures-font " + getManeuverDirectionSymbol(maneuverDirection) + "'></i><div class='dialManeuverSpeedClass'>" + maneuverSpeed + "</div>";
        newDialManeuverElement.setAttribute('class', "dialManeuverElementWrapperClass");
        maneuversWrapperElement.appendChild(newDialManeuverElement);
    }
}

// ------------------------------------------------------------------
// Arrange dial maneuver HTML elements in a circle
// ------------------------------------------------------------------

function arrangeDialManeuverHTMLElementsInACircle(maneuversWrapperElement) {
    // Courtesy of https://codepen.io/dbpas/pen/LGudb
    var type = 1, //circle type - 1 whole, 0.5 half, 0.25 quarter
        radius = '7em', //distance from center
        start = -90, //shift start from 0
        $elements = $(maneuversWrapperElement).children(),
        numberOfElements = (type === 1) ? $elements.length : $elements.length - 1, //adj for even distro of elements when not full circle
        slice = 360 * type / numberOfElements;
    $elements.each(function (i) {
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
}

// ------------------------------------------------------------------
// Add inner and outer circles for the dial
// ------------------------------------------------------------------

function addInnerAndOuterDialCircle(maneuversWrapperElement) {
    var dialInnerCircle = document.createElement("div");
    var dialOuterCircle = document.createElement("div");
    dialInnerCircle.setAttribute('class', "innerCircleDiv");
    dialOuterCircle.setAttribute('class', "outerCircleDiv");
    maneuversWrapperElement.appendChild(dialInnerCircle);
    maneuversWrapperElement.appendChild(dialOuterCircle);
}

// ------------------------------------------------------------------
// Create an HTML element for the dial label
// ------------------------------------------------------------------

function createDialLabelElement(shipCounter, selectedOptionText_shipName) {
    var newDialLabelElement = document.createElement("div");
    newDialLabelElement.setAttribute('class', "dialLabelClass");
    // Set the label text
    newDialLabelElement.innerHTML = "<span class='shipNumberClass' onclick='cycleLabelColor(this)' >" + shipCounter + "</span>" + selectedOptionText_shipName.split(" - ")[1] + "<a onclick='flipDial(this)' class='btn btn-dark btn-sm flip-dial-button'>Flip</a>";
    // Allow scrolling to this dial when the title is clicked
    newDialLabelElement.addEventListener("click", function () {
        console.log("Label clicked: Position: ", this.getBoundingClientRect().top);
        this.scrollIntoView(true);
    });
    return newDialLabelElement;
}

const LABEL_COLORS = ["red", "green", "blue", "orange", "black", "magenta", "gold", "brown"];
function cycleLabelColor(element) {
    var index = LABEL_COLORS.indexOf(element.parentElement.style.backgroundColor);
    index = index + 1;
    if (index >= LABEL_COLORS.length) {
        index = 0;
    }
    element.parentElement.style.backgroundColor = LABEL_COLORS[index];
}

// ------------------------------------------------------------------
// Look up the symbol for this maneuver
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// Function that hides a dial selector and shades the dial
// ------------------------------------------------------------------

function flipDial(clickedElement) {
    // Get the parent element
    var dialWrapperElement = clickedElement.parentElement.parentElement;
    // Get the element(s) you'd like to hide
    var dialManeuversWrapperElement = dialWrapperElement.getElementsByClassName('dialManeuversWrapperClass')[0];
    var outerCircleDiv = dialWrapperElement.getElementsByClassName('outerCircleDiv')[0];
    
    // Toggle visibility of circle
    if (outerCircleDiv.style.background != "transparent") {
        // Revealed dial
        outerCircleDiv.style.background = "transparent";
        outerCircleDiv.style.zIndex = "9";
    } else {
        // Hidden dial
        outerCircleDiv.style.background = "repeating-linear-gradient(45deg, gray, gray 10px, darkgray 10px, darkgray 20px)";
        outerCircleDiv.style.zIndex = "11";
    }

    /*
    // Toggle visibility of selector; do this SEPARATELY
    var selectorElement = dialWrapperElement.getElementsByClassName('maneuverSelectorClass')[0];
    if (outerCircleDiv.style.background != "transparent") {
        // Revealed dial
        selectorElement.style.visibility = "visible";
    } else {
        // Hidden dial
        selectorElement.style.visibility = "hidden";
    }
    */
}




// ------------------------------------------------------------------
// Highlights selected maneuver
// ------------------------------------------------------------------


document.addEventListener('click', function (e) {

	if (e.target.matches('.dialManeuverElementWrapperClass')) {
		
		var maneuverElements = e.target.parentNode.getElementsByClassName("dialManeuverElementWrapperClass");
		for (var i = 0; i < maneuverElements.length; i++) {
		   maneuverElements[i].style.outline = "none";
		}
	
        e.target.style.outline = "solid yellow 2px";
	
	}
});