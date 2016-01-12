(function(angular) {
  'use strict';
angular.module('FlickrApp', ['ngRoute'])

  .factory('ItemDetailService', function() {
    var item = {};

    return {
      setItem:function(data) {
        item = data;
      },
      getItem:function() {
        console.log(item);
        return item;
      }
    }
  })

  .controller('MainController', ['$scope', '$http', '$route', 'ItemDetailService', function($scope, $http, $route, ItemDetailService) {
    $scope.title = "Angular Flickr API App";

    var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tagmode=all&format=json";

    $scope.images = {};

    // Search images
    $scope.search = function(searchCriteria) {

      if (searchCriteria.tags == undefined || searchCriteria.tags.trim() == "") {
        searchCriteria.tags = null;
        return false;
      }
      $scope.form.tags.$setUntouched();
      $scope.form.tags.$setValidity();

      // build URL for Flickr API
      flickrAPI = flickrAPI + "&tags=" + encodeURIComponent($scope.searchCriteria.tags);

      // send AJAX query to Flickr API
      $http.jsonp(flickrAPI)
        .success(function (data, status, headers, config) {
          $scope.images = data;
      })
      .error(function (data, status, headers, config) {
          console.log('error');
      });

      // Reset form validation
      $scope.form.tags.$setValidity();
    };

    // Default to show on load
    $scope.init = function() {

      flickrAPI = flickrAPI + "&tags=potato";

      $http.jsonp(flickrAPI)
        .success(function(data) {
          $scope.images = data;
      })
      .error(function(data) {
          console.log('error')
      });

    };
    $scope.init();

    // Convert Flickr URL into route
    $scope.imageRoute = function(item) {
      var imgUrl = item.link;
      var rtnRoute = imgUrl.replace('http://www.flickr.com','');
      return rtnRoute;
    };

    // Pass the selected item to the service
    $scope.openDetail = function(item) {
      ItemDetailService.setItem(item);
    }

  }])
  .controller('DetailController', ['$scope', '$routeParams', 'ItemDetailService', function($scope, $routeParams, ItemDetailService) {
    $scope.title = "Detail page";
    $scope.item = ItemDetailService.getItem();
  }])

  .config( ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
     .when('/', {
      templateUrl: 'templates/list.html',
      controller: 'MainController'
     })
     .when('/photos/:authorId/:photoId', {
      templateUrl: 'templates/detail.html',
      controller: 'DetailController'
    })

    $locationProvider.html5Mode(true);
  }]);
})(window.angular);

// http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tagmode=all&format=json&tags=potato

// https://docs.angularjs.org/api/ngRoute/service/$route
// https://docs.angularjs.org/tutorial/step_07
// http://stackoverflow.com/questions/16968614/how-to-implment-a-load-more-pagination-in-angularjs-without-ng-repeat
// http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/paginating-using-infinite-results.html
// http://stackoverflow.com/questions/12008908/angularjs-how-can-i-pass-variables-between-controllers
// http://onehungrymind.com/angularjs-sticky-notes-pt-1-architecture/