angular.module('RequestController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('RequestController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;

    $scope.maintenances = [];
    $scope.appTitle = "Request an intervention";
    $scope.resource = "savicsgmao";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Maintenance"] = "/maintenance";
    $scope.equipmentSearchText = "";
    $scope.request = {};

    var dictionary = require("../utils/dictionary");
    var natureofworkjson = require('../../json/maintenance/natureofwork.json');
    $scope.natureofworks = dictionary.getJsonList(natureofworkjson, $rootScope.selectedLanguage);

    $scope.searchEquipments = function (searchText) {
        return openmrsRest.getFull($scope.resource + "/equipment?name=" + searchText).then(function (response) {
            return response.results.filter(function (item) {
                return item.name.toLowerCase().includes(searchText.toLowerCase())
            });
        }, function (e) {
            return [];
        });
    };

    $scope.selectedEquipmentChange = function (item) {
        $scope.request.equipment = item;
    };


    $scope.LoadRequest = function () {
        $scope.loading = true;
        if ($stateParams.uuid && $stateParams.uuid != "new") {//edit
            openmrsRest.getFull($scope.resource + "/maintenanceRequest/" + $stateParams.uuid).then(function (response) {
                $scope.request = response;
                $scope.request.creation = new Date($scope.request.creation);
                $scope.selectedEquipment = $scope.request.equipment;
            }, function (e) {
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {
            $scope.isEditable = true;

            $scope.loading = false;
        }
    }

    $scope.LoadRequest();

    $scope.save = function () {
        if ($scope.request.equipment) {
            $scope.loading = true;
            $scope.request.equipment = $scope.request.equipment.id;
            if ($scope.request && $scope.request.uuid) {//edit
                openmrsRest.update($scope.resource + "/maintenanceRequest", $scope.request).then(function (response) {
                    $scope.request = response;
                    toastr.success($translate.instant('The maintenance request has been successfully updated.'), 'Success');
                    $state.go('home.requests');
                }, function (e) {
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/maintenanceRequest", $scope.request).then(function (response) {
                    toastr.success($translate.instant('The maintenance request has been successfully created.'), 'Success');
                    $state.go('home.requests');
                }, function (e) {
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            }
        } else {
            toastr.error($translate.instant('All required fields must be filled out.'), 'Error');
        }
    }

}]);