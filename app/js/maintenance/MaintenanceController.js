angular.module('MaintenanceController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenanceController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var moment = require('moment');
    $scope.rootscope = $rootScope;
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    $rootScope.links = { "GMAO Module": "", "Maintenance Management": "maintenancemanagement" };
    $scope.maintenance = { maintenanceType: {} };
    $scope.equipment = {};
    $scope.item = null;
    $scope.searchText = "";
    $scope.maintenance_types = [];

    if ($stateParams.maintenance_id) {
        $scope.maintenance = $stateParams.data;
        $scope.maintenance.startdate = new Date(moment(new Date($stateParams.data.startdate)).format('MM/DD/YYYY, h:mm A'));
        $scope.maintenance.enddate = new Date(moment(new Date($stateParams.data.enddate)).format('MM/DD/YYYY, h:mm A'));
        $scope.selectedItem = $stateParams.data.equipment.name;
    }

    $scope.getData = function () {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/maintenanceType").then(function (response) {
            $scope.maintenance_types = response.results;
            if ($stateParams.uuid) {
                openmrsRest.getFull($scope.resource + "/maintenance/" + $stateParams.uuid).then(function (response) {
                    $scope.loading = false;
                    $scope.maintenance = response;
                    $scope.searchText = $scope.maintenance.equipment.name;
                }, function (e) {
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            } else $scope.loading = false;
        }, function (e) {
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
        });
    }

    $scope.save = function () {
        $scope.loading = true;
        var query = JSON.parse(JSON.stringify($scope.maintenance));
        query.maintenanceType = parseInt($scope.maintenance.maintenanceType.id);
        query.equipment = parseInt($scope.equipment.id);
        query.description = !query.description ? "" : query.description;
        query.reason = !query.reason ? "" : query.reason;
        query.status = parseInt($scope.maintenance.status);
        if ($scope.maintenance && query.status) {
            if ($scope.maintenance && $scope.maintenance.uuid) {    //Edit
                openmrsRest.update($scope.resource + "/maintenance", query).then(function (response) {
                    $scope.maintenance = response;
                    $scope.getData();
                    $state.go('home.maintenances', {});
                }, function (e) {
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            } else {    //Creation
                openmrsRest.create($scope.resource + "/maintenance", query).then(function (response) {
                    $scope.maintenance = response;
                    $scope.getData();
                    $state.go('home.maintenances', {});
                }, function (e) {
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            }
        } else {
            $scope.loading = false;
            toastr.error($translate.instant('You must fill in the required fields before you proceed.'), $translate.instant('Error'));
        }
    }

    $scope.getEquipments = function (searchText) {
        return openmrsRest.getFull($scope.resource + "/equipment?name=" + searchText).then(function (response) {
            return response.results;
        });
    };

    $scope.selectedEquipmentChange = function (item) {
        if (item) {
            $scope.equipment = item;
        }
    }

    $scope.getData();

}]);