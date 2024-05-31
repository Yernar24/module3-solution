(function() {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
  
      ctrl.getMatchedMenuItems = function() {
        if (!ctrl.searchTerm) {
          ctrl.found = [];
          ctrl.errorMessage = "Nothing found";
          return;
        }
  
        var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
  
        promise.then(function(response) {
          ctrl.found = response;
          ctrl.errorMessage = ctrl.found.length === 0 ? "Nothing found" : "";
        })
        .catch(function(error) {
          console.log("Something went wrong", error);
        });
      };
  
      ctrl.removeItem = function(itemIndex) {
        ctrl.found.splice(itemIndex, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      var service = this;
  
      service.getMatchedMenuItems = function(searchTerm) {
        return $http({
          method: "GET",
          url: ("https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json")
        }).then(function(result) {
          var foundItems = [];
  
          var items = result.data;
          for (var key in items) {
            if (items[key].description.indexOf(searchTerm) !== -1) {
              foundItems.push(items[key]);
            }
          }
  
          return foundItems;
        });
      };
    }
  
    function FoundItemsDirective() {
      var ddo = {
        templateUrl: 'loader/itemsloaderindicator.template.html',
        scope: {
          items: '<',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'list',
        bindToController: true
      };
  
      return ddo;
    }
  
    function FoundItemsDirectiveController() {
      var list = this;
    }
  
  })();
  