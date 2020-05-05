// ------------------------------------------------------------------
// Constants and global variables
// ------------------------------------------------------------------

var shipCounter = 1;
var useTouchDragInsteadOfMouseDrag = true;
var XWSShipStatisticsURLsArray = null;
// An array containing the ship names and URLs and statistics
var shipInformationArray = [];
// Indeces for easily accesing information in the array
var INDEX_SHIP_FRIENDLY_NAME = 0;
var INDEX_SHIP_DIAL_URL = 1;
var INDEX_SHIP_STATS_URL = 2;

// ------------------------------------------------------------------
// Onload
// ------------------------------------------------------------------

function myOnloadFunction() {
    // Check if touch vs mouse
    useTouchDragInsteadOfMouseDrag = ('ontouchstart' in document.documentElement);
    console.log("Using touch instead of mouse: " + useTouchDragInsteadOfMouseDrag);
    // Get ships from XWS, FFG, and make the dropdown        
    loadXWSShipStatisticsURLsThenGetFFGDataThenPopulateDropDown();
}
