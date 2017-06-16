var locations = [
    {title: 'Jama Masjid', location: {lat: 28.6507, lng:77.2334 }},
    {title: 'The Red Fort', location: {lat: 28.6562, lng: 77.2410}},
    {title: 'Qutb Minar', location: {lat: 28.5244, lng: 77.1855}},
    {title: 'India Gate', location: {lat: 28.6129, lng: 77.2295}},
    {title: 'Lotus temple', location: {lat: 28.5535, lng: 77.2588}},
    {title: 'Rashtrapati bhavan', location: {lat: 28.6144, lng: 77.2166}},
    {title: 'Parliment house', location: {lat: 28.6172, lng: 77.2081}}
    ];
var map;
var markers = [];
var marker;
var placeMarkers = [];

function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34)
            );
            return markerImage;
        }
//function to popoulate the infowindow with streetview,wikilink
function populateInfoWindow(marker, infowindow) {
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                // Clear the infowindow content to give the streetview time to load.
                infowindow.setContent('');
                infowindow.marker = marker;
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    if(infowindow.marker !== null)
                        infowindow.marker.setAnimation(null);
                    infowindow.marker = null;
                });

                var streetViewService = new google.maps.StreetViewService();
                var radius = 50;

                infowindow.setContent(
                    '<div><h5 class=".h5" id="Title">' +
                    marker.title +
                    '</h5></div><div id="wikipedia-links" class="text-left text-info"><p>' +
                    '</p></div><div id="panorama"></div>'
                );

                infowindow.open(map, marker);

                var flag = true;
                var wiki = false;

                var wikiElem = '';
                //function to get streetview
                function getStreetView(data, status) {
                    if (status == google.maps.StreetViewStatus.OK) {
                        var nearStreetViewLocation = data.location.latLng;
                        var heading = google.maps.geometry.spherical.computeHeading(
                            nearStreetViewLocation, marker.position
                            );

                        // error handling
                        var errorTimeout = setTimeout(function() {
                            alert("Something went wrong");
                        }, 9000);
                        clearTimeout(errorTimeout);

                        var panoramaOptions = {
                            position: nearStreetViewLocation,
                            pov: {
                                heading: heading,
                                // this changes the angle of camera whether to look up or down
                                pitch: 15
                            }
                        };
                        var panorama = new google.maps.StreetViewPanorama(
                            document.getElementById('panorama'), panoramaOptions
                            );
                    } else {
                        $('#wikipedia-links').text(wikiElem);
                        $('#panorama').text('');
                        $('#panorama').append("<span class='text-danger '>No Street View Found</span>");
                        flag = false;
                    }
                }

                // Use streetview service to get the closest streetview image within
                // 50 meters of the markers position
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);

                var wikiRequestTimeout = setTimeout(function() {
                    wikiElem = 'failed to get wikipedia resources';
                }, 8000);

                var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                        marker.title +
                        '&format=json&callback=wikiCallback';

                $.ajax({
                    url:wikiUrl,
                    dataType:"jsonp",
                    //jsonp:"callback", by default, using jsonp as datatype will set the callback function name to callback. so, no need to mention it again.
                    success:function(data) {
                        wiki = true;
                        for(var j = 1; j < data.length; j++) {
                            var articeList = data[j];
                            for(var i = 0; i < articeList.length; i++) {
                                articlestr = articeList[i];
                                if(articlestr.length > wikiElem.length) {
                                    wikiElem = articlestr;
                                }
                            }
                        }
                        console.log(wikiElem);

                        if(flag === false) {
                            $('#wikipedia-links').text(wikiElem);
                            $('#panorama').text("");
                            $('#panorama').append("<span class='text-danger '>No Street View Found</span>");
                        } else {
                            $('#wikipedia-links').text(wikiElem);
                        }
                        clearTimeout(wikiRequestTimeout);
                    }
                }).fail(function(jqXHR, textStatus) {
                    if(jqXHR.status === 0) {
                        alert('You are offline!\n Please check your network.');
                    } else if(jqXHR.status == 404) {
                        alert('HTML Error Callback');
                    }
                    else alert( "Request failed: " + textStatus + "<br>");
                });
            }
        }

//function to hidemarkers
        function hideMarkers(markers){
        for(var i=0;i<markers.length;i++)
        {
            markers[i].setMap(null);

        }
    }
//function to create marker for places
    function createMarkersForPlaces(places){
        var bounds = new google.maps.LatLngBounds();
        for(var i=0;i<places.length;i++)
        {
            var place = places[i];
            var icon={
                url: place.icon,
                size: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                id: place.id
            });
            placeMarkers.push(marker);
            if(place.geometry.viewport){
                bounds.union(place.geometry.viewport);
            } else{
                bounds.extend(place.geometry.location);
            }
        }
        map.fitBounds(bounds);
    }
    //function for searchbox
    function searchBoxPlaces(searchbox){
        hideMarkers(placeMarkers);
        var places = searchbox.getPlaces();
        createMarkersForPlaces(places);
        if(places.length===0)
        {
            window.alert("we did not find any place matching to the querry");
        }
    }
    //function for searchbox when go button is clicked
    function textSearchPlaces(){
        var bounds = map.getBounds();
            hideMarkers(placeMarkers);
            var placesService = new google.maps.places.PlacesService(map);
            placesService.textSearch({
                query: document.getElementById('places-search').value,
                bounds: bounds
            }, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    createMarkersForPlaces(results);
                }
            });

    }
function initMap(){
    //creating the map
        map = new google.maps.Map(document.getElementById('map'),{center: {lat: 28.7041, lng: 77.1025},zoom: 11});
        var largeInfoWindow = new google.maps.InfoWindow();
        var defaultIcon = makeMarkerIcon('0091ff');
        var highlightedIcon = makeMarkerIcon('ffff24');
        for(var i=0;i<locations.length;i++)
    {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({

            position: position,
            title: title,
            id: i
        });
        markers.push(marker);
         marker.addListener('click',function(){
            populateInfoWindow(this,largeInfoWindow);
            this.setAnimation(google.maps.Animation.BOUNCE);
                var m = this;
                setTimeout(function() {
                    m.setAnimation(null);
        }, 2000);
        });
         marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(null);
            });

    }

    var searchbox = new google.maps.places.SearchBox(document.getElementById('places-search'));
    searchbox.setBounds(map.getBounds());
    searchbox.addListener('places_changed', function() {
          searchBoxPlaces(this);
        });
            document.getElementById('go-places').addEventListener('click', textSearchPlaces);

    }
//place function
var Place = function(data){
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};
//main viewmodel
var ViewModel = function(){
    var self = this;
    this.placeList = ko.observableArray([]);
    locations.forEach(function(placeitem){
        self.placeList.push(new Place(placeitem));
    });
    this.currentLoc = ko.observable(this.placeList()[0] );
    this.showListing = function(){
        var bounds = new google.maps.LatLngBounds();
        for(var i=0;i<markers.length;i++)
        {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    };
    this.hideListing = function(){
        for(var i=0;i<markers.length;i++)
        {
            markers[i].setMap(null);

        }
    };
    this.CurrentPlace = function(Place){
            self.currentLoc(Place);
            for(var i=0;i<markers.length;i++){
                if(markers[i].title == Place.title())
                {
                    var marker = markers[i];
            marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
        }, 2000);
google.maps.event.trigger(marker, 'click');
                }

            }

    };
    this.TextSearch = function(){
        textSearchPlaces();
    };

    this.searchedLocation = ko.observable('');

    this.Filter = function(value) {
        self.placeList.removeAll();
        for(var i=0;i<locations.length;i++) {
            var searchQuery = locations[i].title.toLowerCase();
            // find the starting match in every location
            if(searchQuery.indexOf(value.toLowerCase()) >= 0) {
                self.placeList.push(locations[i]);
            }
        }
    };

    this.FilterForMarkers = function(value) {
        for (var i in locations) {
            var temp = markers[i];
            if (temp.setMap(this.map) !== null) {
                temp.setMap(null);
            }
            var searchQuery = temp.title.toLowerCase();
            if (searchQuery.indexOf(value.toLowerCase()) >= 0) {
                temp.setMap(map);
            }
        }
    };

    this.searchedLocation.subscribe(this.Filter);
    this.searchedLocation.subscribe(this.FilterForMarkers);
};
//binding
ko.applyBindings(new ViewModel());