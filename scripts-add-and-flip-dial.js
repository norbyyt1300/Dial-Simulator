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
    // Get the dials container
    var dialsContainerElement = document.getElementById("dialsContainer");
    // Add a new dial wrapper as a new element, and set its class
    var newDialWrapperElement = document.createElement("div");
    newDialWrapperElement.setAttribute('class', "dialWrapperClass");
    // Add the label element, and set its class
    var newDialLabelElement = document.createElement("div");
    newDialLabelElement.setAttribute('class', "dialLabelClass");
    // Set the label text
    newDialLabelElement.innerHTML = "<span class='shipNumberClass'>" + shipCounter + "</span>" + selectedOptionText_shipName.split(" - ")[1] + "<a onclick='flipDial(this)' class='btn btn-dark btn-sm flip-dial-button'>Flip</a>";
    // Allow scrolling to this dial when the title is clicked
    newDialLabelElement.addEventListener("click", function () {
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
        addTouchDraggability(maneuverSelectorElement);
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
    $.get(shipStatsURL, function (data, status) {
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
        var previousManeuverSpeed = maneuversArray[0].substring(0, 1);
        for (var i = 0; i < maneuversArray.length; i++) {
            var maneuverString = maneuversArray[i];
            var maneuverSpeed = maneuverString.substring(0, 1);
            var maneuverDirection = maneuverString.substring(1, 2);
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
// Function that hides a dial selector
// ------------------------------------------------------------------

function flipDial(clickedElement) {
    // Get the parent element
    var dialWrapperElement = clickedElement.parentElement.parentElement;
    // Get the element(s) you'd like to hide
    var selectorElement = dialWrapperElement.getElementsByClassName('maneuverSelectorClass')[0];
    var dialManeuversWrapperElement = dialWrapperElement.getElementsByClassName('dialManeuversWrapperClass')[0];
    // Toggle visibility
    if (selectorElement.style.visibility == "hidden") {
        selectorElement.style.visibility = "visible";
        dialManeuversWrapperElement.style.opacity = "1";
    } else {
        selectorElement.style.visibility = "hidden";
        dialManeuversWrapperElement.style.opacity = "0.4";
    }
}