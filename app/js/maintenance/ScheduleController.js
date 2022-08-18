angular.module('ScheduleController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('ScheduleController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var _ = require("underscore");
    var moment = require('moment');
    $scope.rootScope = $rootScope;
    $scope.appTitle = $translate.instant("Maintenance Schedule");
    $scope.resource = "savicsgmao";
    $rootScope.links = { "Module GMAO": "", "Schedule": "Schedule", "add": "Schedule" };
    $scope.loading = false;
    $scope.maintenance_types = [];
    //Breadcrumbs properties
    $scope.equipement = {};

    var dictionary = require("../utils/dictionary");

    var schedule_typesjson = require('../../json/maintenance/scheduletype.json');
    $scope.schedule_types = dictionary.getJsonList(schedule_typesjson, $rootScope.selectedLanguage);

    $scope.selectedEquipmentChange = function (item) {
        if (item) {
            $scope.equipment = item;
        }
    }

    $scope.getEquipments = function (searchText) {
        return openmrsRest.getFull($scope.resource + "/equipment?name=" + searchText).then(function (response) {
            return response.results;
        });
    };

    $scope.getData = function () {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/maintenanceType").then(function (response) {
            $scope.maintenance_types = response.results;
            $scope.loading = false;
        }, function (e) {
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
        });
    }


    $scope.save = function () {
        $scope.loading = true;
        var query = JSON.parse(JSON.stringify($scope.equipment));
        delete query.country;
        delete query.countrySanitary;
        delete query.hdcsi;
        delete query.departementhdcsi;
        if ($scope.equipment && $scope.equipment.serialNumber && $scope.equipment.serialNumber.length >= 3 && $scope.equipment.serialNumber.length <= 120 && $scope.equipment.name && $scope.equipment.name != "") {
            if ($scope.equipment.uuid) {    //Edit
                openmrsRest.update($scope.resource + "/equipment", query).then(function (response) {
                    $scope.equipment = response;
                    toastr.success($translate.instant('Data saved successfully.'), 'Success');
                    $state.go('home.equipments');
                    $scope.loading = false;
                }, function (e) {
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            } else {    //Creation
                openmrsRest.create($scope.resource + "/equipment", query).then(function (response) {
                    toastr.success($translate.instant('Data saved successfully.'), 'Success');
                    $state.go('home.equipments');
                    $scope.loading = false;
                }, function (e) {
                    $scope.loading = false;
                    console.error(e)
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            }
        } else {
            $scope.loading = false;
            if (!$scope.equipment.serialNumber || !$scope.equipment.name || !$scope.equipment.equipmentType || !$scope.equipment.serviceStatus || !$scope.equipment.site) {
                toastr.error($translate.instant('You must fill in the required fields before you proceed.'), $translate.instant('Error'));
            }
            if ($scope.equipment.serialNumber && ($scope.equipment.serialNumber.length <= 3 || $scope.equipment.serialNumber.length > 120)) {
                toastr.error($translate.instant('The equipment serialNumber must be between 3 and 120 characters max.'), $translate.instant('Error'));
            } else if ($scope.equipment.name && $scope.equipment.name == "") {
                toastr.error($translate.instant('The equipment name must not be empty.'), $translate.instant('Error'));
            }
        }
    }

    $scope.getData();

}]);
