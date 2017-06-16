#### neighborhood_map
A single-page application featuring a map of your neighborhood.

### quickstart:
clone the repo.
run index.html file.

### Api used:
## Google Map Api.
Display map markers identifying at least 5 locations that you are interested in within this neighborhood. This app should displays those locations by default when the page is loaded.

A list view of the set of locations is implemented

A filter option is that uses an input field to filter both the list view and the map markers displayed by default on load. The list view and the markers are updated accordingly in real time.

## Wikipedia's API.
A functionality is added using third-party APIs to provide information when a map marker or list view entry is clicked. Note that StreetView and Places don't count as an additional 3rd party API because they are libraries included in the Google Maps API.

### FrameWork:
Knockout.
Knockout is a JavaScript library that helps you to create rich, responsive display and editor user interfaces with a clean underlying data model. Any time you have sections of UI that update dynamically (e.g., changing depending on the user’s actions or when an external data source changes), KO can help you implement it more simply and maintainably.

### usage:

Clicking a marker on the map should open more information about that location.

Clicking a name in the list view should open the information window for the associated marker.

The list of locations should be filterable with a text input or dropdown menu. Filtering the list also filters the markers on the map.

This web app is also responsive.

Display places searched in the input box for nearby places and also providing corresponding infoWIndows or description for those places.

