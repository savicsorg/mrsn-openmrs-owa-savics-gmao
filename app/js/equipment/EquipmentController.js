angular.module('EquipmentController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('EquipmentController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var _ = require("underscore");
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Equipment management");
    $scope.resource = "savicsgmao";
    $rootScope.links = { "Pharmacy management module": "", "Equipment": "equipments", "Edit": "equipment" };
    $scope.loading = false;
    $scope.equipment = {};
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Equipements"] = "/equipements";
    $scope.equipement = {};
    $scope.replacementComponents = [
        { name: $translate.instant("yes"), value: "yes" },
        { name: $translate.instant("no"), value: "no" },
        { name: $translate.instant("unknown"), value: "unknown" }
    ];
    $scope.acquisitionModes = [
        { name: $translate.instant("donation"), value: "donation" },
        { name: $translate.instant("purchase"), value: "purchase" },
        { name: $translate.instant("unknown"), value: "unknown" }];

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

    function loadServiceStatus() {
        return openmrsRest.getFull($scope.resource + "/service").then(function (response) {
            $scope.equipmentServices = response.results;
        }, function (e) {
            $scope.equipmentServices = [];
        });
    };

    loadAllOpenMRSRegions();
    loadAllDistricts();
    loadAllHealthCenters();
    loadAllServices();
    loadAllSites();
    loadEquipmentTypes();
    loadServiceStatus();

    $scope.regionChanged = function (id) {
        console.log("regionChanged " + id);
        $scope.healthCenters = [];
        $scope.services = [];
        $scope.districts = [];
        $scope.sites = [];
        $scope.districts = _.where(allDistricts, { regionid: id });
    }

    $scope.districtChanged = function (id) {
        console.log("districtChanged " + id);
        $scope.services = [];
        $scope.healthCenters = [];
        $scope.sites = [];
        $scope.healthCenters = _.filter(allHealthCenters, function (item) {
            return item.district.id === id;
        });
    }

    $scope.healthCenterChanged = function (id) {
        console.log("healthCenterChanged " + id);
        $scope.services = [];
        $scope.sites = [];
        $scope.services = _.filter(allServices, function (item) {
            return item.healthcenter.id === id;
        });
    }

    $scope.departementChanged = function (id) {
        console.log("departementChanged " + id);
        $scope.sites = [];
        $scope.sites = _.filter(allSites, function (item) {
            return item.service.id === id;
        });
    }


    $scope.save = function () {
        $scope.loading = true;
        var query = JSON.parse(JSON.stringify($scope.equipment));
        console.log("-------------------------------------");
        console.log(query);
        console.log("-------------------------------------");
        query.status = !query.status ? 0 : query.status;
        if ($scope.equipment && $scope.equipment.serialNumber && $scope.equipment.serialNumber.length >= 3 && $scope.equipment.serialNumber.length <= 120 && $scope.equipment.name && $scope.equipment.name != "") {
            if ($scope.equipment.uuid) {    //Edit
                openmrsRest.update($scope.resource + "/equipment", query).then(function (response) {
                    $scope.equipment = response;
                    //$scope.getData();
                    //$state.go('home.equipments', {});
                    toastr.success($translate.instant('Data saved successfully.'), 'Success');
                    $state.go('home.equipments');
                    $scope.loading = false;
                }, function (e) {
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            } else {    //Creation
                openmrsRest.create($scope.resource + "/equipment", query).then(function (response) {
                    //$scope.equipment = response;
                    //$scope.getData();
                    toastr.success($translate.instant('Data saved successfully.'), 'Success');
                    $state.go('home.equipments');
                    $scope.loading = false;
                }, function (e) {
                    $scope.loading = false;
                    console.log(e)
                    toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                });
            }
        } else {
            $scope.loading = false;
            if (!$scope.equipment.serialNumber || !$scope.equipment.name) {
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
