$(function(){
    ko.applyBindings(ViewModel);
    ViewModel.loadCoffeeList()
})
var ViewModel = {
    coffeeList : ko.observableArray([]),
    loadCoffeeList : function() {
        var self = this;
         $.getJSON("js/model.json", function(data){
            self.coffeeList(data);
        })
    }
}

