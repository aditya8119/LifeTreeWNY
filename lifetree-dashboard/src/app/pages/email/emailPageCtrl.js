/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.email')
    .controller('EmailPageCtrl', EmailPageCtrl);


  /** @ngInject */
  function EmailPageCtrl($scope,dataResource) {
    var m1 = {
      "name": "Every Minute",
      "value": "*"
    }
    $scope.minutes = [
      m1,
      {
        "name": "Every Other Minute",
        "value": "*"
      }, {
        "name": "Every Five Minutes",
        "value": "*/5"
      }, {
        "name": "Every Ten Minutes",
        "value": "*/10"
      }, {
        "name": "Every Fifteen Minutes",
        "value": "*/15"
      },
      { "name": "1", "value": "1" },
      { "name": "2", "value": "2" },
      { "name": "3", "value": "3" },
      { "name": "4", "value": "4" },
      { "name": "5", "value": "5" },
      { "name": "6", "value": "6" },
      { "name": "7", "value": "7" },
      { "name": "8", "value": "8" },
      { "name": "9", "value": "9" },
      { "name": "10", "value": "10" },
      { "name": "11", "value": "11" },
      { "name": "12", "value": "12" },
      { "name": "13", "value": "13" },
      { "name": "14", "value": "14" },
      { "name": "15", "value": "15" },
      { "name": "16", "value": "16" },
      { "name": "17", "value": "17" },
      { "name": "18", "value": "18" },
      { "name": "19", "value": "19" },
      { "name": "20", "value": "20" },
      { "name": "21", "value": "21" },
      { "name": "22", "value": "22" },
      { "name": "23", "value": "23" },
      { "name": "24", "value": "24" },
      { "name": "25", "value": "25" },
      { "name": "26", "value": "26" },
      { "name": "27", "value": "27" },
      { "name": "28", "value": "28" },
      { "name": "29", "value": "29" },
      { "name": "20", "value": "30" },
      { "name": "31", "value": "31" },
      { "name": "32", "value": "32" },
      { "name": "33", "value": "33" },
      { "name": "34", "value": "34" },
      { "name": "35", "value": "35" },
      { "name": "36", "value": "36" },
      { "name": "37", "value": "37" },
      { "name": "38", "value": "38" },
      { "name": "39", "value": "39" },
      { "name": "40", "value": "40" },
      { "name": "41", "value": "41" },
      { "name": "42", "value": "42" },
      { "name": "43", "value": "43" },
      { "name": "44", "value": "44" },
      { "name": "45", "value": "45" },
      { "name": "46", "value": "46" },
      { "name": "47", "value": "47" },
      { "name": "48", "value": "48" },
      { "name": "49", "value": "49" },
      { "name": "50", "value": "50" },
      { "name": "51", "value": "51" },
      { "name": "52", "value": "52" },
      { "name": "53", "value": "53" },
      { "name": "54", "value": "54" },
      { "name": "55", "value": "55" },
      { "name": "56", "value": "56" },
      { "name": "57", "value": "57" },
      { "name": "58", "value": "58" },
      { "name": "59", "value": "59" }
 ];

    $scope.minselection = {};
    $scope.minselection.selected = m1;


    var h1 = {
      "name": "Every Hour",
      "value": "*"
    }

    $scope.hours = [
      h1
      , {
        "name": "Every Other Hour",
        "value": "*"
      }, {
        "name": "Every Four Hour",
        "value": "*/4"
      }, {
        "name": "Every Six Hour",
        "value": "*/6"
      },
       {
          "name": "1",
           "value": "1" 
          },
       { 
         "name": "2",
         "value": "2"
         },
       { 
         "name": "3",
         "value": "3" 
        },
       { 
         "name": "4",
          "value": "4" 
        },
       {
          "name": "5",
           "value": "5"
       },
       {
          "name": "6",
           "value": "6" 
          },
       {
          "name": "7",
           "value": "7" 
        },
       {
          "name": "8",
           "value": "8" 
          },
       {
          "name": "9",
           "value": "9" 
          },
       {
          "name": "10",
          "value": "10"
         },
       {
          "name": "11",
           "value": "11"
           },
       {
          "name": "12",
           "value": "12"
           }];
    $scope.hourselection = {};
    $scope.hourselection.selected = h1;

    var mon1 = {
      "name": "Every Month",
      "value": "*"
    }
    $scope.months = [
      mon1,
      {
        "name": "January",
        "value": "1"
      }, {
        "name": "February",
        "value": "2"
      }, {
        "name": "March",
        "value": "3"
      }, {
        "name": "April",
        "value": "4"
      },
      { 
       "name": "May",
       "value": "5" 
      },
       {
        "name": "June",
       "value": "6"
       },
       {
        "name": "July",
        "value": "7"
       },
       { 
        "name": "August",
        "value": "8"
       },
       { 
        "name": "September",
        "value": "9" 
      },
      { 
        "name": "October",
        "value": "10" 
      },
      { 
        "name": "November",
        "value": "11" 
      },
      { 
        "name": "December",
        "value": "12" 
      }
      ];

    $scope.monselection = {};
    $scope.monselection.selected = mon1;

    var day1 = {
      "name": "Every Day",
      "value": "*"
    }
    $scope.days = [
      day1, {
        "name": "1",
        "value": "1"
      }, {
        "name": "2",
        "value": "2"
      }, {
        "name" : "3",
        "value": "3"
      }, {
        "name": "4",
        "value": "4"
      },
      { "name": "5", "value": "5" },
      { "name": "6", "value": "6" },
      { "name": "7", "value": "7" },
      { "name": "8", "value": "8" },
      { "name": "9", "value": "9" },
      { "name": "10", "value": "10" },
      { "name": "11", "value": "11" },
      { "name": "12", "value": "12" },
      { "name": "13", "value": "13" },
      { "name": "14", "value": "14" },
      { "name": "15", "value": "15" },
      { "name": "16", "value": "16" },
      { "name": "17", "value": "17" },
      { "name": "18", "value": "18" },
      { "name": "19", "value": "19" },
      { "name": "20", "value": "20" },
      { "name": "21", "value": "21" },
      { "name": "22", "value": "22" },
      { "name": "23", "value": "23" },
      { "name": "24", "value": "24" },
      { "name": "25", "value": "25" },
      { "name": "26", "value": "26" },
      { "name": "27", "value": "27" },
      { "name": "28", "value": "28" },
      { "name": "29", "value": "29" },
      { "name": "30", "value": "30" },
      { "name": "31", "value": "31" }
      ];

    $scope.dayselection = {};
    $scope.dayselection.selected = day1;

    var week1 = {
      "name": "Every Weekday",
      "value": "*"
    }
    $scope.weekdays = [
      week1,
      {
        "name": "Sunday",
        "value": "SUN"
      }, {
        "name": "Monday",
        "value": "MON"
      }, {
        "name": "Tuesday",
        "value": "TUE"
      }, {
        "name": "Wednesday",
        "value": "WED"
      },
      {
        "name": "Thursday",
       "value": "THU"
       },
      {
         "name": "Friday",
       "value": "FRI" 
      },
      {
         "name": "Saturday",
       "value": "SAT" 
      }];


    $scope.weekselection = {};
    $scope.weekselection.selected = week1;

    var emailConfig;
    $scope.saveConfig = function () {
      emailConfig = {
        title: $scope.title,
        message: $scope.message,
        cron: $scope.minselection.selected.value + " " + $scope.hourselection.selected.value + " " + $scope.dayselection.selected.value + " " + $scope.monselection.selected.value + " " + $scope.weekselection.selected.value
      }

      dataResource.updateFollowUpConfig(emailConfig).then(function success() {
        console.log("Email Config Upated");
      });
    }
  }



})();