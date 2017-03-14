var CLIENT_ID = 'QER25ZOFOI5NZUNVJZOFB4YJFCLGYHB51FTIWFO2IOHTRWS3';
var CLIENT_SECRET = 'TNXWNKHS1CXIK1VPPEYIYDJVCE0J0Z3AYMYBZSKWVS4A1AIC';
var URL = 'https://api.foursquare.com/v2/venues/explore?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&near=San Francisco,CA&section=food&limit=10&v=20170309&query=coffee&venuePhotos=1';
var map, infowindow, displayWindow;
var mapSuccess = ko.observable(false);
var contentString = '<div class=\'infoWindow\'>' + '<div class=\'left\'><img src=\'%imgSource%\'/></div>' + '<div class=\'right\'>' + '<h3>%locationName%</h3>' + '<p>%address%</p>' + '<span>Stars: %stars%</span>' + '</div></div>';
function initMap() {
  var SFO = {
    lat: 37.7749,
    lng: -122.4194
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: SFO
  });
  google.maps.event.addDomListener(window, 'resize', function () {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
  });
  infowindow = new google.maps.InfoWindow();
}
//google maps error function and knockout css visibility toggle
function mapError() {
    mapSuccess(true);
}
function toggleBounceAndInfo(marker) {
   
  if (marker.marker.getAnimation() !== null) {
      marker.marker.setAnimation(null);
      infowindow.close();
  } else {
    marker.marker.setAnimation(google.maps.Animation.BOUNCE);
      displayWindow = contentString.replace('%locationName%', marker.name).replace('%address%', marker.address).replace('%stars%', marker.rating).replace('%imgSource%', marker.photoUrl);
      //single infowindow declaration and value set using `setContent`
      infowindow.setContent(displayWindow);
    infowindow.open(map, marker.marker);
    //modified timeout to be multiple of 700 ms.
    setTimeout(function () {
      marker.marker.setAnimation(null);
      infowindow.close();
    }, 1400);
  }
}
var Marker = function (lat, lng, name, address, rating, photoUrl) {
  this.name = name;
  this.address = address;
  this.rating = rating;
  this.photoUrl = photoUrl;
  this.marker = new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng
    },
    map: map,
    animation: google.maps.Animation.DROP
  });
 
};
var coffeeData = '';
var ViewModel = function () {
  var self = this;
  this.coffeeList = ko.observableArray([]);
  this.filteredCoffeeList = ko.observableArray([]);
  this.coffeeInput = ko.observable('');
  this.markerList = ko.observableArray([]);
  this.dataSuccess = ko.observable(false);
  this.classToggle = ko.observable(false);
  $.ajax({ url: URL }).done(function (data) {
    //sanity check on ajax returned data
    if(data && data.response && data.response.groups){
      coffeeData = data.response.groups[0].items;
      self.coffeeList(coffeeData);
      coffeeData.map(function (item, index) {
        var venue = item.venue,
            name = venue.name || "No Venue available",
            rating = venue.rating || "No Rating available",
            photoSize = '40x40',
            photos = venue.featuredPhotos.items[0],
            photoUrl = (photos.prefix + photoSize + photos.suffix) || "No Photos available",
            location = venue.location,
            address = location.address || "No Location available",
            marker = new Marker(location.lat, location.lng, name, address, rating, photoUrl);
        google.maps.event.addListener(marker.marker, 'click', function () {
          toggleBounceAndInfo(marker);
        });
        //on closing infowindow, stop marker animation.
        google.maps.event.addListener(infowindow, 'closeclick', function () {
          marker.marker.setAnimation(null);
        });
        self.markerList.push(marker);
      });
    }else{
      self.dataSuccess(true);  
    }
  }).fail(function (error) {
    self.dataSuccess(true);
    console.error(error);
  }).always(function () {
    self.filterInput();
  });
  //updated filterFunction to properly render filtered content on input.
  this.filterInput = function () {
    self.filteredCoffeeList.removeAll();
    var entry = self.coffeeInput().toLowerCase();
    ko.utils.arrayFilter(self.markerList(), function (item) {
     var itemName = item.name;
      if (itemName.length > 0)
        itemName = itemName.toLowerCase();
      var contains = itemName.indexOf(entry) >= 0;
      if (contains) {
        self.filteredCoffeeList.push(item);
      }
      item.marker.setVisible(contains);
    });
  };
  self.clickCoffee = function (item) {
      
    toggleBounceAndInfo(item);
  };
  //use css binding for visibility toggle.
  this.toggleList = function () {
    self.classToggle(!self.classToggle());
  };
  this.coffeeInput.subscribe(this.filterInput);
};
ko.applyBindings(new ViewModel());