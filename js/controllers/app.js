(function(angular) {
  'use strict';
angular.module('routeApp', ['ngRoute'])

 .controller('MainController', function($scope, $http, $route) {
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
      
      // reset form validation
      $scope.form.tags.$setValidity();
    };

    // Default to show on load
    var init = function() {
      flickrAPI = flickrAPI + "&tags=potato";

      $http.jsonp(flickrAPI)
        .success(function (data, status, headers, config) {
          $scope.images = data;
      })
      .error(function (data, status, headers, config) {
          console.log('error')
      });
    };
    init();

    $scope.imageRoute = function(item) {
      var imgUrl = item.link;

      var imageRoute = imgUrl.replace('http://www.flickr.com','');

      return imageRoute;
    };
 })
 .controller('DetailController', function($scope, $routeParams) {
     $scope.title = "Detail page";
     $scope.params = $routeParams;
 })

  .config(function($routeProvider, $locationProvider) {
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
});
})(window.angular);

// http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tagmode=all&format=json&tags=potato

// https://docs.angularjs.org/api/ngRoute/service/$route
// https://docs.angularjs.org/tutorial/step_07
