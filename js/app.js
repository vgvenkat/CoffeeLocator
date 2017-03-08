var ViewModel = function(){
    this.coffeeList = ko.observableArray([]);
    this.filteredCoffeeList = ko.observableArray([]);
    this.coffeeInput = ko.observable('');
   
        var self = this;
         $.getJSON("js/model.json", function(data){
            self.coffeeList(data);
        }).done(function(){
            self.filterInput();
        })
    
    this.filterInput = function() {
        self.filteredCoffeeList.removeAll();
        var entry = self.coffeeInput().toLowerCase();
        console.log(entry.length,self.coffeeList())
        ko.utils.arrayFilter(self.coffeeList(), function(item) {
            var isThere = item.name.toLowerCase().indexOf(entry)
            if(isThere>=0) {
                self.filteredCoffeeList.push(item);
            }
        
        })

       
    }
    
    this.coffeeInput.subscribe(this.filterInput)
}
ko.applyBindings(new ViewModel());