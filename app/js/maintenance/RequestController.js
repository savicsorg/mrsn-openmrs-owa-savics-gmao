angular.module('RequestController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('RequestController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
        $scope.rootscope = $rootScope;
        var moment = require('moment');
        $scope.maintenances = [];
        $scope.appTitle = "Request an intervention";
        $scope.resource = "savicsgmao";
        //Breadcrumbs properties
        $rootScope.links = {"Module GMAO": "", "Maintenance Management": "maintenancemanagement"};
        $scope.equipmentSearchText = "";
        $scope.request = {};

        $scope.validateBtn = {
            text: $translate.instant("Validate"),
            enabled: false,
            visible: false
        };

        $scope.cancelBtn = {
            text: $translate.instant("Cancel"),
            status: $translate.instant("Initiated"),
            canceled: false,
            visible: false,
            enabled: false,
            background: "#ccc"
        };
        
        $scope.isEditable = true;

        var dictionary = require("../utils/dictionary");
        var natureofworkjson = require('../../json/maintenance/natureofwork.json');
        var priorityjson = require('../../json/maintenance/priority.json');
        $scope.natureofworks = dictionary.getJsonList(natureofworkjson, $rootScope.selectedLanguage);
        $scope.prioritys = dictionary.getJsonList(priorityjson, $rootScope.selectedLanguage);

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

                    if ($stateParams.data.status == "VALID") {
                        $scope.isEditable = false;
                        $scope.validateBtn.text = $translate.instant("Validated on ") + new Date($scope.request.approval).toLocaleDateString();
                        $scope.validateBtn.enabled = false;
                        $scope.validateBtn.visible = true;
                        $scope.cancelBtn.visible = true;
                    } else if ($stateParams.data.status == "REJECT") {
                        $scope.isEditable = false;
                        $scope.validateBtn.text = $translate.instant("Rejected on ") + new Date($scope.request.approval).toLocaleDateString();
                        $scope.validateBtn.enabled = false;
                        $scope.validateBtn.visible = true;
                        $scope.cancelBtn.visible = true;
                    } else {

                        $scope.validateBtn.enabled = true;
                        $scope.validateBtn.visible = true;
                    }

                    if ($stateParams.canBeValidated == true) {
                        $scope.validateBtn.visible = true;
                        $scope.cancelBtn.visible = true;
                    } else {
                        $scope.validateBtn.visible = false;
                        $scope.cancelBtn.visible = false;
                    }


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

        if ($stateParams.request_id) {
            $scope.request = $stateParams.data;
            $scope.request.creation = new Date(moment(new Date($stateParams.data.creation)).format('MM/DD/YYYY, h:mm A'));
            $scope.selectedEquipment = $stateParams.data.equipment.name;

            if ($stateParams.data.status == "VALID") {
                $scope.isEditable = false;
                $scope.validateBtn.text = $translate.instant("Validated on ") + new Date($scope.request.approval).toLocaleDateString();
                $scope.validateBtn.enabled = false;
                $scope.validateBtn.visible = true;
                $scope.cancelBtn.visible = true;
            } else if ($stateParams.data.status == "REJECT") {
                $scope.isEditable = false;
                $scope.validateBtn.text = $translate.instant("Rejected on ") + new Date($scope.request.approval).toLocaleDateString();
                $scope.validateBtn.enabled = false;
                $scope.validateBtn.visible = true;
                $scope.cancelBtn.visible = true;
            } else {
                $scope.validateBtn.enabled = true;
                $scope.validateBtn.visible = true;
            }
            if ($stateParams.canBeValidated == true) {
                $scope.validateBtn.visible = true;
                $scope.cancelBtn.visible = true;
            } else {
                $scope.validateBtn.visible = false;
                $scope.cancelBtn.visible = false;
            }
        }

        $scope.reject = function () {
            $mdDialog.show($mdDialog.confirm()
                    .title('Confirmation')
                    .textContent($translate.instant('Do you really want to reject this request  of maintenance?'))
                    .ok($translate.instant('Yes'))
                    .cancel($translate.instant('Cancel'))).then(function () {
                $scope.loading = true;
                $scope.request.approval = moment(new Date()).format("YYYY-MM-D hh:mm:ss");
                $scope.request.status = "REJECT";
                $scope.save();

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
                $scope.save();
            }, function () {

            });
        }

        $scope.save = function () {
            if ($scope.request.equipment) {
                $scope.loading = true;
                $scope.request.equipment = $scope.request.equipment.id;
                $scope.request.approver = "";
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
                    $scope.request.status = "INIT";
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