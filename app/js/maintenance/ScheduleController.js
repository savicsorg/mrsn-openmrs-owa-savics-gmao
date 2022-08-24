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

    $scope.validateBtn = {
        text: $translate.instant("Validate"),
        enabled: false,
        visible: false
    };
    $scope.is_periodical = false;

    var dictionary = require("../utils/dictionary");

    var schedule_typesjson = require('../../json/maintenance/scheduletype.json');
    $scope.schedule_types = dictionary.getJsonList(schedule_typesjson, $rootScope.selectedLanguage);

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


    $scope.save = function () {
        $scope.loading = true;
        var query = JSON.parse(JSON.stringify($scope.schedule));
        console.log($scope.schedule);
        if ($scope.schedule && $scope.schedule.equipment && $scope.schedule.name && $scope.schedule.description && $scope.schedule.type.id && $scope.schedule.startdate) {
            if ($scope.schedule.uuid) {    //Edit
                openmrsRest.update($scope.resource + "/schedule", query).then(function (response) {
                    $scope.schedule = response;
                    toastr.success($translate.instant('Data saved successfully.'), 'Success');
                    $state.go('home.maintenanceSchedule');
                    $scope.loading = false;
                }, function (e) {
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            } else {    //Creation
                openmrsRest.create($scope.resource + "/schedule", query).then(function (response) {
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
            .textContent($translate.instant('Do you really want to reject this request  of maintenance?'))
            .ok($translate.instant('Yes'))
            .cancel($translate.instant('Cancel'))).then(function () {
                $scope.loading = true;
                $scope.request.approval = moment(new Date()).format("YYYY-MM-D hh:mm:ss");
                $scope.request.status = "REJECT";
                // $scope.save();
            }, function () {

            });
    }

    $scope.approve = function () {
        $mdDialog.show($mdDialog.confirm()
            .title('Confirmation')
            .textContent($translate.instant('Do you really want to approve this request of maintenance ?'))
            .ok($translate.instant('Yes'))
            .cancel($translate.instant('Cancel'))).then(function () {
                $scope.loading = true;
                $scope.request.approval = moment(new Date()).format("YYYY-MM-D hh:mm:ss");
                $scope.request.status = "VALID";
                // $scope.save();
            }, function () {

            });
    }


}]);
