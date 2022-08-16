angular.module('ScheduleController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('ScheduleController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var _ = require("underscore");
    var moment = require('moment');
    $scope.rootScope = $rootScope;
    $scope.appTitle = $translate.instant("Maintenance Schedule");
    $scope.resource = "savicsgmao";
    $rootScope.links = { "Module GMAO": "", "Schedule": "Schedule", "Edit": "Schedule" };
    $scope.loading = false;
    $scope.equipment = {};
    //Breadcrumbs properties
    $scope.equipement = {};

    var dictionary = require("../utils/dictionary");

    var schedule_typesjson = require('../../json/maintenance/scheduletype.json');
    var acquisitionModesjson = require('../../json/equipment/acquisitionModes.json');
    var disposableManualsjson = require('../../json/equipment/disposableManuals.json');
    var equipmentServicesjson = require('../../json/equipment/equipmentStatus.json');
    $scope.schedule_types = dictionary.getJsonList(schedule_typesjson, $rootScope.selectedLanguage);
    $scope.acquisitionModes = dictionary.getJsonList(acquisitionModesjson, $rootScope.selectedLanguage);
    $scope.disposableManuals = dictionary.getJsonList(disposableManualsjson, $rootScope.selectedLanguage);
    $scope.equipmentServices = dictionary.getJsonList(equipmentServicesjson, $rootScope.selectedLanguage);

    $scope.allRegions = [];
    var allDistricts = [];
    $scope.districts = [];
    var allHealthCenters = [];
    $scope.healthCenters = [];
    var allServices = [];
    $scope.services = [];
    var allSites = [];
    $scope.sites = [];
    $scope.site = { district: {} };


    $scope.regionChanged = function (id) {
        $scope.equipment.district = undefined;
        $scope.equipment.healthcenter = undefined;
        $scope.equipment.service = undefined;
        $scope.equipment.site = undefined;
        $scope.healthCenters = [];
        $scope.services = [];
        $scope.districts = [];
        $scope.sites = [];
        $scope.districts = _.filter(allDistricts, function (item) {
            return item.regionid === id;
        });
    }

    $scope.districtChanged = function (id) {
        $scope.equipment.healthcenter = undefined;
        $scope.equipment.service = undefined;
        $scope.equipment.site = undefined;
        $scope.services = [];
        $scope.healthCenters = [];
        $scope.sites = [];
        $scope.healthCenters = _.filter(allHealthCenters, function (item) {
            return item.district.id === id;
        });
    }

    $scope.healthCenterChanged = function (id) {
        $scope.equipment.service = undefined;
        $scope.equipment.site = undefined;
        $scope.services = [];
        $scope.sites = [];
        $scope.services = _.filter(allServices, function (item) {
            return item.healthcenter.id === id;
        });
    }

    $scope.departementChanged = function (id) {
        $scope.equipment.site = undefined;
        $scope.sites = [];
        $scope.sites = _.filter(allSites, function (item) {
            return item.service.id === id;
        });
    }

    function loadAllOpenMRSRegions() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/addressHierarchy?level=2").then(function (response) {
            $scope.loading = false;
            $scope.allRegions = response.results;
        }, function (e) {
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadAllDistricts() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/district").then(function (response) {
            $scope.loading = false;
            allDistricts = response.results;
            if ($stateParams.equipment_id) {
                $scope.districts = response.results;
            }
        }, function (e) {
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadAllHealthCenters() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/healthcenter").then(function (response) {
            allHealthCenters = response.results;
            $scope.loading = false;
            if ($stateParams.equipment_id) {
                $scope.healthCenters = response.results;
            }
        }, function (e) {
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadAllServices() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/service").then(function (response) {
            allServices = response.results;
            $scope.loading = false;
            if ($stateParams.equipment_id) {
                $scope.services = response.results;
            }
        }, function (e) {
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadAllSites() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/site").then(function (response) {
            $scope.loading = false;
            allSites = response.results;
            if ($stateParams.equipment_id) {
                $scope.sites = response.results;
            }
        }, function (e) {
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadEquipmentTypes() {
        return openmrsRest.getFull($scope.resource + "/equipmentType").then(function (response) {
            $scope.equipmentTypes = response.results;
        }, function (e) {
            $scope.equipmentTypes = [];
        });
    };

    loadAllOpenMRSRegions();
    loadAllDistricts();
    loadAllHealthCenters();
    loadAllServices();
    loadAllSites();
    loadEquipmentTypes();


    if ($stateParams.equipment_id) {
        $scope.equipment = $stateParams.data;
        // $scope.site = $stateParams.data.site;
        $scope.equipment.equipmentType = $stateParams.data.equipmentType.id;
        $scope.equipment.acquisitionDate = new Date(moment(new Date($stateParams.data.acquisitionDate)).format('MM/DD/YYYY'));
        $scope.equipment.country = $stateParams.data.site.service.healthcenter.district.regionid;
        $scope.equipment.countrySanitary = $stateParams.data.site.service.healthcenter.district.id;
        $scope.equipment.hdcsi = $stateParams.data.site.service.healthcenter.id;
        $scope.equipment.departementhdcsi = $stateParams.data.site.service.id;
        $scope.equipment.site = $stateParams.data.site.id;
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



}]);
