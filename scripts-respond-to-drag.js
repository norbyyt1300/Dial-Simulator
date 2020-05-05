// ------------------------------------------------------------------
// Code for enabling dragging
// Courtesy of https://www.w3schools.com/howto/howto_js_draggable.asp
// ------------------------------------------------------------------

function addMouseDraggability(maneuverSelectorElement) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // otherwise, move the DIV from anywhere inside the DIV: 
    maneuverSelectorElement.onmousedown = dragMouseDown;
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
        maneuverSelectorElement.style.top = (maneuverSelectorElement.offsetTop - pos2) + "px";
        maneuverSelectorElement.style.left = (maneuverSelectorElement.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        // Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// ------------------------------------------------------------------
// Courtesy of https://mobiforge.com/design-development/touch-friendly-drag-and-drop
// ------------------------------------------------------------------

function addTouchDraggability(maneuverSelectorElement) {
    maneuverSelectorElement.addEventListener('touchmove', function (event) {
        // Get the touch event
        var touch = event.targetTouches[0];
        var touchOffsetInPx = 25;
        // Place element where the finger is, minus an offset
        maneuverSelectorElement.style.left = touch.pageX - touchOffsetInPx + 'px';
        maneuverSelectorElement.style.top = touch.pageY - touchOffsetInPx + 'px';
        event.preventDefault();
    }, false);
}