(function(angular) {
  'use strict';
angular.module('FlickrController', ['ngRoute'])

 .controller('MainController', ['$scope', '$http', '$route', 'ItemDetail', function($scope, $http, $route, ItemDetail) {

    // Define Variables
    var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tagmode=all&format=json";

    // Set images object
    $scope.images = {};
    $scope.searching = false;

    // Search images function
    $scope.search = function(searchCriteria) {
      $scope.searching = true;

      // build URL for Flickr API
      flickrAPI = flickrAPI + "&tags=" + encodeURIComponent($scope.searchCriteria.tags);

      // Send AJAX query to Flickr API
      $http.jsonp(flickrAPI)
        .success(function (data, status, headers, config) {
          $scope.images = data;
          $scope.searching = false;
      })
      .error(function (data, status, headers, config) {
          console.log('error');
          $scope.searching = false;
      });

      // Reset form validation
      $scope.form.tags.$setValidity();
    };

    // Default to show on load
    $scope.init = function() {

      // build URL for Flickr API
      flickrAPI = flickrAPI + "&tags=potato";

      // Send AJAX query to Flickr API
      $http.jsonp(flickrAPI)
        .success(function(data) {
          $scope.images = data;
      })
      .error(function(data) {
          console.log('error')
      });
    };
    $scope.init();

    $scope.myDate = function(date) {
      var date = new Date(date),

          year = date.getFullYear(), 
          month = date.getMonth(), 
          day = date.getDate(),
          hour = date.getHours(),
          minute = date.getMinutes(),

          monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      function nth(day) {
        var nth = '';
        if( day > 3 && day < 21) nth = 'th'; 
        switch (day % 10) {
          case 1:  nth = "st";
          case 2:  nth = "nd";
          case 3:  nth = "rd";
          default: nth = "th";
        }
        return day + nth;
      }

      if(minute < 10) minute = '0' + minute;

      var rtnDate = nth(day) + ' ' + monthNames[month] + ' ' + year + ' at ' + hour + ':' + minute;

      console.log(rtnDate);

      return rtnDate;
    }

    // Convert Flickr URL into route
    $scope.imageRoute = function(item) {
      var imgUrl = item.link;
      var rtnRoute = imgUrl.replace('http://www.flickr.com','');
      return rtnRoute;
    };

    // Pass the selected item to the service
    $scope.openDetail = function(item) {
      ItemDetail.setItem(item);
    }

    // I have not included pagination / inmfinite scrolling because the Public Feed is limited to 20 recent images (with or without tags). I could include a dummy infinite scrolling upto the max 20 images, but I dont think that's what is required. Would require the full API and use the page=X and per_page=X parameters to display images

 }])
 .controller('DetailController', ['$scope', '$routeParams', '$sce', 'ItemDetail', function($scope, $routeParams, $sce, ItemDetail) {

    // Build detail page with data from service
    $scope.title = "Detail page";
 //   $scope.item = ItemDetail.getItem();

    var myItem = ItemDetail.getItem();

    $scope.item = myItem;

    $scope.myTags = [];
    angular.forEach(myItem.tags.split(' '), function(tag) {
      $scope.myTags.push(tag);
    });

    $scope.myDate = function(date) {
      // TODO - move this into a service, repeated code is bad and I know it :)
      var date = new Date(date),

          year = date.getFullYear(), 
          month = date.getMonth(), 
          day = date.getDate(),
          hour = date.getHours(),
          minute = date.getMinutes(),

          monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      function nth(day) {
        var nth = '';
        if( day > 3 && day < 21) nth = 'th'; 
        switch (day % 10) {
          case 1:  nth = "st";
          case 2:  nth = "nd";
          case 3:  nth = "rd";
          default: nth = "th";
        }
        return day + nth;
      }

      if(minute < 10) minute = '0' + minute;

      var rtnDate = nth(day) + ' ' + monthNames[month] + ' ' + year + ' at ' + hour + ':' + minute;

      console.log(rtnDate);

      return rtnDate;
    }

    // Not used because the Public Feed description includes images etc - it doesnt not include a text only field (either HTML or plain). Would require using the full API to collect detailed image data
    //$scope.myDescription = $sce.trustAsHtml(myItem.description); // output HTML tags
    // In view...
    // <p ng-bind-html="myDescription">{{ myDescription }}</p>
    
    // On more investigation of the API, the description text is always in the same location...
    function getDescription(el) {
      var htmlWrapper = document.createElement('div');
      htmlWrapper.innerHTML = el;
      var theDescription = htmlWrapper.getElementsByTagName('p');
      if(theDescription[2]) {
        theDescription = theDescription[2].outerHTML;
        theDescription = theDescription.replace(/<\/?[^>]+>/gi, '');
      } else {
        theDescription = "No description available";
      }
      return theDescription;
    }
    $scope.myDescription = getDescription(myItem.description);

 }])

  .config( ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    // Routing information
    $routeProvider
     .when('/', {
      templateUrl: 'templates/list.html',
      controller: 'MainController'
     })
     .when('/photos/:authorId/:photoId', {
      templateUrl: 'templates/detail.html',
      controller: 'DetailController'
    })

    // HTML5 FTW
    $locationProvider.html5Mode(true);
  }]);
})(window.angular);

// http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tagmode=all&format=json&tags=potato

// TODO
// Move API call into service - no need to call twice. Pass search vaiable into function and return result object
// Use Flickr REST API instead of Public Feed to allow for pagination / infinite scroll
// Search input - serach multiple tags, breakup input into list
