var CLIENT_ID = 'QER25ZOFOI5NZUNVJZOFB4YJFCLGYHB51FTIWFO2IOHTRWS3';
var CLIENT_SECRET = 'TNXWNKHS1CXIK1VPPEYIYDJVCE0J0Z3AYMYBZSKWVS4A1AIC';
var URL = 'https://api.foursquare.com/v2/venues/explore?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&near=San Francisco,CA&section=food&limit=10&v=20170309&query=coffee&venuePhotos=1';
var map;
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
}
function mapError() {
    $(".list-button-container")
    .append("<p class='error'>Error Loading Google Maps</p>");
}
function toggleBounceAndInfo(marker) {
   
  if (marker.marker.getAnimation() !== null) {
    marker.marker.setAnimation(null);
    marker.infowindow.close();
  } else {
    marker.marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.infowindow.open(map, marker.marker);
    setTimeout(function () {
      marker.marker.setAnimation(null);
      marker.infowindow.close();
    }, 3500);
  }
}
var Marker = function (lat, lng, name, address, rating, photoUrl) {
  this.name = name;
  this.marker = new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng
    },
    map: map,
    animation: google.maps.Animation.DROP
  });
  var displayWindow = contentString.replace('%locationName%', name).replace('%address%', address).replace('%stars%', rating).replace('%imgSource%', photoUrl);
  this.infowindow = new google.maps.InfoWindow({ content: displayWindow });
};
var coffeeData = '';
var ViewModel = function () {
  var self = this;
  this.coffeeList = ko.observableArray([]);
  this.filteredCoffeeList = ko.observableArray([]);
  this.coffeeInput = ko.observable('');
  this.markerList = ko.observableArray([]);
  this.dataSuccess = ko.observable(false);
  $.ajax({ url: URL }).done(function (data) {
    coffeeData = data.response.groups[0].items;
    self.coffeeList(coffeeData);
    coffeeData.map(function (item, index) {
      var venue = item.venue;
      var photoSize = '40x40';
      var photos = venue.featuredPhotos.items[0];
      var photoUrl = photos.prefix + photoSize + photos.suffix;
      var location = venue.location;
      var marker = new Marker(location.lat, location.lng, venue.name, location.address, venue.rating, photoUrl);
      google.maps.event.addListener(marker.marker, 'click', function () {
           if (infowindow) {
        infowindow.close();
    }
        toggleBounceAndInfo(marker);
      });
      self.markerList.push(marker);
    });
  }).fail(function (error) {
    self.dataSuccess(true);
    console.error(error);
  }).always(function () {
    self.filterInput();
  });
  this.filterInput = function () {
    self.filteredCoffeeList.removeAll();
    var entry = self.coffeeInput().toLowerCase();
    ko.utils.arrayFilter(self.markerList(), function (item) {
      itemName = item.name;
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
  this.toggleList = function () {
    var nav = $('.nav'), navWidth = nav.width();
    nav.toggleClass('toggle');
  };
  this.coffeeInput.subscribe(this.filterInput);
};
ko.applyBindings(new ViewModel());