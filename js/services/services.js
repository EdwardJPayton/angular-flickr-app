(function(angular) {
  'use strict';
  angular.module('FlickrService', [])
  .factory('ItemDetail', function() {
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
})(window.angular);