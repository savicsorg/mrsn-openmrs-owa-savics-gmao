angular.module('MaintenanceController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenanceController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
        var moment = require('moment');
        $scope.rootScope = $rootScope;
        $scope.resource = "savicsgmao";
        $scope.loading = false;
        $rootScope.links = {"Module GMAO": "", "Maintenance Management": "maintenancemanagement"};
        $scope.maintenance = {maintenanceType: {}};
        $scope.equipment = {};
        $scope.item = null;
        $scope.findByRequest = false;
        $scope.editMode = false;
        $scope.searchText = "";
        $scope.maintenance_types = [];
        $scope.pendingRequests = [];
        $scope.selectedMaintenanceRequest = undefined;
        

        if ($stateParams.maintenance_id) {
            $scope.maintenance = $stateParams.data;
            $scope.maintenance.startdate = new Date(moment(new Date($stateParams.data.startdate)).format('MM/DD/YYYY, h:mm A'));
            $scope.maintenance.enddate = new Date(moment(new Date($stateParams.data.enddate)).format('MM/DD/YYYY, h:mm A'));
            $scope.selectedItem = $stateParams.data.equipment.name;
            $scope.selectedMaintenanceRequest = $stateParams.data.maintenanceRequest;
            if ($scope.selectedMaintenanceRequest) {
                $scope.findByRequest = true;
            }
            $scope.editMode = true;
        } else if ($stateParams.data && $stateParams.data.equipment) {
            $scope.equipment = $stateParams.data.equipment;
            $scope.selectedItem = $stateParams.data.equipment.name;
            $scope.selectedMaintenanceRequest = $stateParams.data.maintenanceRequest;
            if ($scope.selectedMaintenanceRequest) {
                $scope.findByRequest = true;
            }
            $scope.editMode = true;
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
                        $scope.selectedMaintenanceRequest = $scope.maintenance.maintenanceRequest;
                        if ($scope.maintenance.maintenanceRequest){
                            $scope.activeMaintenancesRequests.push($scope.maintenance.maintenanceRequest);
                        }
                        
                        if ($scope.maintenance.maintenanceRequest) {
                            $scope.findByRequest = true;
                        }
                    }, function (e) {
                        $scope.loading = false;
                        toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                    });
                } else
                    $scope.loading = false;
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
            console.log("$scope.selectedMaintenanceRequest");
            console.log($scope.selectedMaintenanceRequest);
            if ($scope.selectedMaintenanceRequest) {
                query.maintenanceRequest = parseInt($scope.selectedMaintenanceRequest.id);
            }

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

        $scope.getMaintenanceRequest = function () {
            openmrsRest.getFull($scope.resource + "/maintenanceRequest?status=VALID").then(function (response) {
                $scope.activeMaintenancesRequests = response.results;
            });
        };
        $scope.getMaintenanceRequest();

        $scope.selectedEquipmentChange = function (item) {
            if (item) {
                $scope.equipment = item;
            }
        }

        $scope.selectedMaintenanceRequestChange = function (mRequest) {
            $scope.selectedMaintenanceRequest = mRequest;
            if (mRequest) {
                $scope.equipment = mRequest.equipment;
                $scope.selectedItem = mRequest.equipment.name;
            }
        }

        $scope.getData();

        var watch = {};
        watch.findByRequest = $scope.$watch('findByRequest', function (newval, oldval) {
            if (newval == false) {
                $scope.equipment = undefined;
                $scope.selectedItem = undefined;
            }
        });

        $scope.$on('$destroy', function () {// in case of destroy, we destroy the watch
            watch.findByRequest();
        });

    }]);