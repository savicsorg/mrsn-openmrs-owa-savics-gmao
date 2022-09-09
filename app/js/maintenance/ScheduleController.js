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
    $scope.schedule = {};

    $scope.rejectBtn = {
        enabled: false,
    };

    $scope.is_periodical = false;

    var dictionary = require("../utils/dictionary");

    var schedule_typesjson = require('../../json/maintenance/scheduletype.json');
    $scope.schedule_types = dictionary.getJsonList(schedule_typesjson, $rootScope.selectedLanguage);

    if ($stateParams.data && $stateParams.data.uuid) {
        $scope.schedule = $stateParams.data;
        $scope.selectedItem = $stateParams.data.equipment.name;
        $scope.rejectBtn.enabled = ($stateParams.data.status == 1) ? true : false;
        if ($stateParams.data.frequency === "N/A") {
            $scope.is_periodical = false;
            $scope.schedule_type = false;
            $scope.schedule.startdate = new Date(moment(new Date($stateParams.data.startdate)).format('MM/DD/YYYY, h:mm A'));
            $scope.schedule.enddate = new Date(moment(new Date($stateParams.data.enddate)).format('MM/DD/YYYY, h:mm A'));
        } else {
            $scope.is_periodical = true;
            $scope.schedule_type = true;
            $scope.schedule.frequency = _.find($scope.schedule_types, function (p) { return p.value === $stateParams.data.frequency; });
            $scope.schedule.startdate = new Date(moment(new Date($stateParams.data.startdate)).format('MM/DD/YYYY, h:mm A'));
            $scope.schedule.enddate = new Date(moment(new Date($stateParams.data.enddate)).format('MM/DD/YYYY, h:mm A'));
        }
    }

    $scope.selectedEquipmentChange = function (item) {
        if (item) {
            $scope.schedule.equipment = item;
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

    $scope.save = function (mode) {
        $scope.loading = true;
        $scope.schedule.equipment = $scope.schedule.equipment.id;
        $scope.schedule.priority = 0;
        if ($scope.is_periodical) {
            $scope.schedule.frequency = $scope.schedule.frequency.id;
            if (mode) {
                $scope.schedule.status = 1;
            }
        } else {
            $scope.schedule.frequency = "N/A";
            $scope.schedule.startdate = new Date();
            $scope.schedule.status = 0;
        }
        if ($scope.schedule) {
            if ($scope.schedule.uuid) {    //Edit
                openmrsRest.update($scope.resource + "/maintenanceEvent", $scope.schedule).then(function (response) {
                    $scope.schedule = response;
                    toastr.success($translate.instant('Data saved successfully.'), 'Success');
                    $state.go('home.maintenanceSchedule');
                    $scope.loading = false;
                }, function (e) {
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            } else {    //Creation
                openmrsRest.create($scope.resource + "/maintenanceEvent", $scope.schedule).then(function (response) {
                    toastr.success($translate.instant('Data saved successfully.'), 'Success');
                    $state.go('home.maintenanceSchedule');
                    $scope.loading = false;
                }, function (e) {
                    $scope.loading = false;
                    console.error(e)
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            }
        } else {
            $scope.loading = false;
            toastr.error($translate.instant('You must fill in the required fields before you proceed.'), $translate.instant('Error'));
        }
    }


    $scope.getData();

    $scope.toggleSchedule = function (type) {
        $scope.is_periodical = type;
    };

    $scope.reject = function () {
        $mdDialog.show($mdDialog.confirm()
            .title('Confirmation')
            .textContent($translate.instant('Do you really want to terminate this maintenance schedule?'))
            .ok($translate.instant('Yes'))
            .cancel($translate.instant('Cancel'))).then(function () {
                $scope.schedule.status = 0;
                $scope.save(false);
            }, function () {

            });
    }

}]);
