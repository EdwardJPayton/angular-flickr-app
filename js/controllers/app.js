(function(angular) {
  'use strict';
angular.module('routeApp', ['ngRoute'])

 .controller('MainController', function($scope, $http, $route) {
     var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tagmode=all&format=json";

    $scope.images = {};

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
          $scope.imagesStatus = status;
      })
      .error(function (data, status, headers, config) {
          console.log(data, status);
      });
      
      // reset form validation
      $scope.form.tags.$setValidity();
    };

    var init = function() {
      flickrAPI = flickrAPI + "&tags=potato";

      $http.jsonp(flickrAPI)
        .success(function (data, status, headers, config) {
          $scope.images = data;
          $scope.imagesStatus = status;
      })
      .error(function (data, status, headers, config) {
          console.log('error')
      });
    }
    init();
 })

 .controller('BookController', function($scope, $routeParams) {
     $scope.name = "BookController";
     $scope.params = $routeParams;
 })

 .controller('ChapterController', function($scope, $routeParams) {
     $scope.name = "ChapterController";
     $scope.params = $routeParams;
 })

.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home.html',
    controller: 'MainController'
   })
   .when('/Book/:bookId', {
    templateUrl: 'book.html',
    controller: 'BookController'
  })
  .when('/Book/:bookId/ch/:chapterId', {
    templateUrl: 'chapter.html',
    controller: 'ChapterController'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});
})(window.angular);

// http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tagmode=all&format=json&tags=potato

// https://docs.angularjs.org/api/ngRoute/service/$route
