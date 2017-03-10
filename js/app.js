var CLIENT_ID='QER25ZOFOI5NZUNVJZOFB4YJFCLGYHB51FTIWFO2IOHTRWS3'
var CLIENT_SECRET='TNXWNKHS1CXIK1VPPEYIYDJVCE0J0Z3AYMYBZSKWVS4A1AIC'
var URL= "https://api.foursquare.com/v2/venues/explore?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&near=San Francisco,CA&section=food&limit=10&v=20170309&query=coffee"
var map;
function initMap() {
    var SFO = {
        lat: 37.7749,
        lng: -122.4194
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: SFO

    });
    // var marker = new google.maps.Marker({
    //     position: SFO,
    //     map: map,
    //     animation: google.maps.Animation.DROP
    // });
    // marker.addListener('click', toggleBounce);

    
}
function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){marker.setAnimation(null)}, 5000);
        }
    }

var Marker = function(lat, lng, timeout) {
    window.setTimeout(function(){
  this.marker =  new google.maps.Marker({
                position:{lat: lat, lng: lng},
                map: map,
                animation: google.maps.Animation.DROP
            })
            }, timeout)
}
var coffeeData = '';
    
var ViewModel = function () {
    this.coffeeList = ko.observableArray([]);
    this.filteredCoffeeList = ko.observableArray([]);
    this.coffeeInput = ko.observable('');
    this.markerList = ko.observableArray([]);
    var self = this;
    // $.getJSON("js/model.json", function (data) {
    //     self.coffeeList(data);
    // }).done(function () {
    //     self.filterInput();
    // })
    $.ajax({
            url: URL
        }).done(function(data){
            coffeeData = data.response.groups[0].items;
            self.coffeeList(coffeeData);
            coffeeData.map(function(item, index){
                
            var marker = new Marker(item.venue.location.lat, item.venue.location.lng, index*200);
            
            self.markerList.push(marker.marker)
            })
        }).fail(function(error){
            console.log(error)
        }).always(function(){
            self.filterInput();
        })
    this.filterInput = function () {
        self.filteredCoffeeList.removeAll();
        var entry = self.coffeeInput().toLowerCase();
        console.log(entry.length, self.coffeeList())
        ko.utils.arrayFilter(self.coffeeList(), function (item) {
            itemName = item.venue.name
            if(itemName.length>0) itemName = itemName.toLowerCase()
            var isThere = itemName.indexOf(entry) 
            if (isThere >= 0) {
                self.filteredCoffeeList.push(item);
            }

        })


    }

    this.coffeeInput.subscribe(this.filterInput)
}
ko.applyBindings(new ViewModel());