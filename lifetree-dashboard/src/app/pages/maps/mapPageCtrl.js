(function () {
        'use strict';

        angular.module('BlurAdmin.pages.maps')
          .controller('MapPageCtrl', MapPageCtrl);


        /** @ngInject */
        function MapPageCtrl(NgMap, $scope, dataResource) {
          NgMap.getMap().then(function(map) {
            $scope.map = map;
        });
          var geocoder = new google.maps.Geocoder();
          $scope.customerLocation = [];
          $scope.customerDetails=[];
          fetchAddress();
          NgMap.getMap().then(function (map) {
            $scope.map = map;
          });
          var nextAddress=0;
          function fetchAddress() {
            dataResource.fetchAddress().then(function success(response) {
              response.data.forEach(function (item, index) {
                      Object.keys(item).map(function (key, index) {
                        if(item[key].address){
                        console.log(item[key]);
                        $scope.customerDetails.push(
                          {
                            "address": String(item[key].address+ ', '+item[key].city),
                            "firstName": item[key].firstName,
                            "lastName": item[key].lastName,
                            "total": item[key].total,
                          });
                        }
              });
            });
          
            theNext();
            }, function error(err) {
              console.log(err);
            });
          }
          function theNext() {
            if (nextAddress < $scope.customerDetails.length) {
              geocodeAddress($scope.customerDetails[nextAddress],theNext);
              nextAddress++;
            }
          }


        function geocodeAddress(customerDetail, next) {
            geocoder.geocode({ address: customerDetail.address }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                var p = results[0].geometry.location;
                var lat = p.lat();
                var lng = p.lng();
                createMarker(customerDetail, lat, lng);
              }
              next();
            }
            );
          }

          function createMarker(customerDetail, lat, lng) {
            $scope.customerLocation.push({
              address: customerDetail.address,
              pos: [lat, lng],
              name: customerDetail.firstName +" "+customerDetail.lastName,
              total: "$"+customerDetail.total
            });
            $scope.showAddress = function (event, customer) {
              $scope.selectedAddress =  customer
              $scope.map.showInfoWindow('myInfoWindow', this);
            };
          }
        }
})();