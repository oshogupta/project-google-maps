//model
// create list of locations to be marked on maps
var City = [{

        name: 'Bistro226',
        lat: 30.9056,
        lng: 75.8328,
        foursquareId: '4def5bc31fc7e81f6da422a5',
        selected: false,
        show: true
    },
    {
        name: 'Cinepolis',
        lat: 30.8825,
        lng: 75.7820,
        foursquareId: '4fc8a7b8e4b00f55991f4261',
        selected: false,
        show: true
    },
    {
        name: 'MBD Neopolis',
        lat: 30.8831,
        lng: 75.7817,
        foursquareId: '4cd66405a5b3468812bf9350',
        selected: false,
        show: true
    },
    {
        name: 'Hot Breads ',
        lat: 30.8930,
        lng: 75.8215,
        foursquareId: '4ce2dd7cf8cdb1f7a884a412',
        selected: false,
        show: true
    },
    {
        name: 'Bakes and Beans',
        lat: 30.8972,
        lng: 75.8302,
        foursquareId: '4b640a07f964a520769c2ae3',
        selected: false,
        show: true
    },



];
//------------model end ---------
	 var  heatmap;


      function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
      }

      function changeGradient() {
        var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)'
        ]
        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
      }

      function changeRadius() {
        heatmap.set('radius', heatmap.get('radius') ? null : 40);
      }

      function changeOpacity() {
        heatmap.set('opacity', heatmap.get('opacity') ? null : 0.9);
      }
	   function getPoints() {
        return [
          new google.maps.LatLng(30.9056, 75.8328),
          new google.maps.LatLng(30.8825, 75.7820),
          new google.maps.LatLng( 30.8831, 75.7817),
          new google.maps.LatLng(30.8930,  75.8215),
		  new google.maps.LatLng( 30.8972, 75.8302),
];
		  }








var locations = []; //arrary of markers to be shown on maps
//viewmodel2:::name
var viewmodel2 = function() {
    var dMarkers = makeeMarkersIcoon('#00ffcc'); //default color of marker to be stored in default icon
    var hMarkers = makeeMarkersIcoon('#cc00ff'); //color when we click mouse or hover on it
    var Infowindow = new google.maps.InfoWindow(); //info window of marker.

    function makeeMarkersIcoon(markerColor) { //passing marker color and building marker icon in this function to tell what marker will do
        var markersImg = new google.maps.MarkerImage(
            //it is just like a fnote work same as pin  ::
            //     http://chart.googleapis.com/chart?chst=d_fnote_title&chld=balloon|1|#99ffea| '
            //chst::type of marker
            //chld::styling of marker
            'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            new google.maps.Size(50,50), //size of marker height and widh
            new google.maps.Point(0, 0),
            new google.maps.Point(12, 33), //accuracy of pointing .
            new google.maps.Size(50, 50));
        return markersImg;
    }










    for (i = 0; i < City.length; i++) {
        var marker = new google.maps.Marker({
            // settings marker's details in marker variable
            //by iterating it into a loop through all places that we decided in model

            position: {
                lat: City[i].lat, //inserting latitude and longitude
                lng: City[i].lng
            },
            icon: dMarkers, //setting icon to default marker
            map: map, //set markers on map
            title: City[i].name, //title of markers
            rating: '', //ratings of places that we added
            venue: City[i].foursquareId, //foursquare id
            selected: City[i].selected, //marker is selectr not
            image: '', //setting image when click on marker
            lat: '', // latitude
            lng: '', // longitude
			 draggable: true,
            //applying animations on markers
            animation: google.maps.Animation.DROP,
            show: ko.observable(true)
        });
        locations.push(marker); //adding marker in location array


        marker.addListener('mouseover', function() { //when we take mouse on marker we change color of it to
            this.setIcon(hMarkers); // calling setIcon() color of highlighted icon
        });
        marker.addListener('mouseout', function() {
            this.setIcon(dMarkers); //when we take are mouse away from marker calling function setIcon color changes back to default
        });
        //Animate markers on click
        var makeDrop = null;
        var dropmarker = function() {
            if (makeDrop !== null)
                makeDrop.setAnimation(null);
            if (makeDrop !== this) {
                this.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    makeDrop.setAnimation(null);
                }, 600);
                makeDrop = this;
            } else
                makeDrop = null;
        };
        google.maps.event.addListener(marker, 'click', dropmarker);
        marker.addListener('click', function() {
            opnInfoWndow(this, Infowindow); //on clicking marker calling function opnInfoWndow()
        });
    }


    // get rating for each marker
    locations.forEach(function(n) {
        //passing n for marker
        $.ajax({ //ajax request for foursquare api
            method: 'GET',
            dataType: "json",
            url: "https://api.foursquare.com/v2/venues/" + n.venue + "?client_id=ZDFKX10FZPOEFES0JCFVQMO2MPRJYDSFMIYOUAO53RDRK00U&client_secret=QUKAYKCOJHBAUFKUJCUONLCAOZUDXE20P1U0OQGZZBLNCIII&v=20170508",
            success: function(data) { //if data is successfully fetch than function will execute
                var venue = data.response.venue;
                var imgurl = data.response.venue.photos.groups[0].items[0];
                //var lt=data.response.venue;

                //var lg=data.response.venue;
                if ((venue.hasOwnProperty('rating')) || (venue.location.hasOwnProperty('lat'))  || (venue.location.hasOwnProperty('address')) || (venue.location.hasOwnProperty('lng')) || ((imgurl.hasOwnProperty('prefix')) && (imgurl.hasOwnProperty('suffix')))) {
                    //to get lat and lng on info window of marker
                    n.lat = venue.location.lat;
                    n.lng = venue.location.lng;
                    n.address= venue.location.address;
					 n.rating = venue.rating;
                    n.image = imgurl.prefix + "100x100" + imgurl.suffix;
                } else {
                    n.rating = '';
                    n.imgurl = '';
                    n.lat = '';
                    n.lng = '';
					n.address = '';

                }
            },
            error: function(e) { //if any error occur in fetching data
                alert('Found error while data fetching ');
            }

        });
    });



    function opnInfoWndow(marker, infowindow) //opening info window on click of marker
    {
        //displaying all the specified requirements on clicking a marker
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + '<h3>' + marker.title + '</h3>' + "<h4>Ratings:" + marker.rating + '</h4> </div><div><img src="' + marker.image + '">' + '<h3>Latitude:::' + marker.lat + '</h3>' + '<h3>Longitude:::' + marker.lng + '</h3>'+'<h3>address:::' + marker.address + '</h3></div>'); //set content that should be appear in info window

            //content that should be appear in info window

            if (marker.rating !== null || marker.image !== null) {
                infowindow.open(map, marker);
            }
            if (marker.lat !== null || marker.lng !== null) {
                infowindow.open(map, marker);
            }
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    }
    //the marker which is selected open its pop up window
    this.selectAll = function(marker) {

        opnInfoWndow(marker, Infowindow);
        marker.selected = true;
        marker.setAnimation(google.maps.Animation.DROP);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 600); //set time for animation taking place on the marker
    };


    //function for search bar
    this.inputText = ko.observable('');
    this.filtersearch = function() {
        Infowindow.close(); //close all the info window that are previously opened window
        var inputSearch = this.inputText();
        console.log(inputSearch);
        if (inputSearch.length === 0) {
            this.show_All(true);
        } else {
            for (i = 0; i < locations.length; i++) {
                //formula for filtering search options when u enter the name on the search bar
                if (locations[i].title.toLowerCase().indexOf(inputSearch.toLowerCase()) === 0) {
                    locations[i].show(true);
                    locations[i].setVisible(true);
                } else {
                    locations[i].show(false);
                    locations[i].setVisible(false);
                }
            }
        }
        Infowindow.close();
    };
    ///show the desired results
    this.show_All = function(variable) {


        for (i = 0; i < locations.length; i++) {
            locations[i].show(variable);
            locations[i].setVisible(variable);
        }
    };

};
