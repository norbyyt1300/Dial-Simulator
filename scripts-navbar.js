// ------------------------------------------------------------------
// Filter the list of dials!
// ------------------------------------------------------------------

function filterDials(filterText) {
    console.log("Filtering to only show dials for:", filterText);
    // Get all options
    var selectOptions = document.getElementsByClassName("shipTypeOptionElement");
    // Loop and toggle their visibility
    var first = true;
    for (var i = 0; i < selectOptions.length; i++) {
        // Ff this select does not contain the filter text, then hide it
        if (selectOptions[i].innerHTML.indexOf(filterText) == -1 ) {
            selectOptions[i].style.display = "none";
        } else {
            // Otherwise, show this option
            selectOptions[i].style.display = "block";
            if (first) {
                document.getElementById("shipSelectorDropDown").selectedIndex = i + 1;
                first = false;
            }
        }
    }
}