angular.module('MovementController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MovementController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var _ = require("underscore");
    var moment = require('moment');
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Equipment movement");
    $scope.resource = "savicsgmao";
    $rootScope.links = { "gmao management module": "", "movement": "movements", "Edit": "movement" };
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Movement"] = "/movements";
    $scope.operation = {};
    $scope.equipments = [];

    $scope.districts = [];
    var allHealthCenters = [];
    $scope.healthCenters = [];
    var allServices = [];
    $scope.services = [];
    var allSites = [];
    $scope.sites = [];

    $scope.operation.d_district = undefined;
    $scope.operation.d_hd = undefined;
    $scope.operation.d_service = undefined;
    $scope.operation.d_site = undefined;
    $scope.operation.s_district = undefined;
    $scope.operation.s_hd = undefined;
    $scope.operation.s_service = undefined;
    $scope.operation.s_site = undefined;

    $scope.districtChanged = function (mode, id) {
        if (mode = "source") {
            $scope.operation.s_hd = undefined;
            $scope.operation.s_service = undefined;
            $scope.operation.s_site = undefined;
        } else {
            $scope.operation.d_hd = undefined;
            $scope.operation.d_service = undefined;
            $scope.operation.d_site = undefined;
        }
        $scope.services = [];
        $scope.healthCenters = [];
        $scope.sites = [];
        $scope.healthCenters = _.filter(allHealthCenters, function (item) {
            return item.district.id === id;
        });
    }

    $scope.healthCenterChanged = function (mode, id) {
        if (mode = "source") {
            $scope.operation.s_service = undefined;
            $scope.operation.s_site = undefined;
        } else {
            $scope.operation.d_service = undefined;
            $scope.operation.d_site = undefined;
        }
        $scope.services = [];
        $scope.sites = [];
        $scope.services = _.filter(allServices, function (item) {
            return item.healthcenter.id === id;
        });
    }

    $scope.departementChanged = function (mode, id) {
        if (mode = "source") {
            $scope.operation.s_site = undefined;
        } else {
            $scope.operation.d_site = undefined;
        }
        $scope.sites = [];
        $scope.sites = _.filter(allSites, function (item) {
            return item.service.id === id;
        });
    }

    function getAllEquipments() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
            $scope.loading = false;
            $scope.equipments = response.results;
            console.log($scope.equipments);
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllEquipments()."), "error");
        });
    }

    function loadAllDistricts() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/district").then(function (response) {
            $scope.loading = false;
            $scope.districts = response.results;
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
            $scope.healthCenters = response.results;
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
            $scope.services = response.results;
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
            $scope.sites = response.results;
        }, function (e) {
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }
    getAllEquipments();
    loadAllDistricts();
    loadAllHealthCenters();
    loadAllServices();
    loadAllSites();

    if ($stateParams.operation_id) {
        $scope.operation = $stateParams.data;
        $scope.operation.s_district = $stateParams.data.siteBySourceId.service.healthcenter.district.id;
        $scope.operation.s_hd = $stateParams.data.siteBySourceId.service.healthcenter.id;
        $scope.operation.s_service = $stateParams.data.siteBySourceId.service.id;
        $scope.operation.s_site = $stateParams.data.siteBySourceId.id;
        $scope.operation.d_district = $stateParams.data.siteByDestinationId.service.healthcenter.district.id;
        $scope.operation.d_hd = $stateParams.data.siteByDestinationId.service.healthcenter.id;
        $scope.operation.d_service = $stateParams.data.siteByDestinationId.service.id;
        $scope.operation.d_site = $stateParams.data.siteByDestinationId.id;
        $scope.operation.equipment = $stateParams.data.id;
        $scope.operation.siteBySource = $stateParams.data.siteBySourceId.id;
        $scope.operation.siteByDestination = $stateParams.data.siteByDestinationId.id;
        $scope.operation.date = new Date(moment(new Date($stateParams.data.date)).format('MM/DD/YYYY'));
        $scope.selectedItem = $stateParams.data.selectedItem;
    }

    $scope.selectedItemChange = function (item) {
        if (item) {
            $scope.operation.s_district = item.site.service.healthcenter.district.id;
            $scope.operation.s_hd = item.site.service.healthcenter.id;
            $scope.operation.s_service = item.site.service.id;
            $scope.operation.s_site = item.site.id;
            $scope.operation.equipment = item.id;
            $scope.operation.siteBySource = item.site.id;
        } else {
            $scope.operation.s_district = undefined;
            $scope.operation.s_hd = undefined;
            $scope.operation.s_service = undefined;
            $scope.operation.s_site = undefined;
            $scope.operation.equipment = undefined;
            $scope.operation.siteBySource = undefined;
            $scope.operation.localapproval = undefined;
            $scope.operation.localapprover = undefined;
            $scope.operation.centralapproval = undefined;
            $scope.operation.centralapprover = undefined;
        }
    }

    $scope.save = function () {
        $scope.loading = true;
        var query = JSON.parse(JSON.stringify($scope.operation));
        delete query.s_district;
        delete query.s_hd;
        delete query.s_service;
        delete query.s_site;
        delete query.d_district;
        delete query.d_hd;
        delete query.d_service;
        query.siteByDestination = query.d_site;
        query.localapproval = query.date;
        query.localapprover = "";
        query.centralapproval = query.date;
        query.centralapprover = "";
        if ($stateParams.operation_id) {    //Edit
            openmrsRest.update($scope.resource + "/mouvement", query).then(function (response) {
                $scope.operation = response;
                toastr.success($translate.instant('Data saved successfully.'), 'Success');
                $state.go('home.movements');
                $scope.loading = false;
            }, function (e) {
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
            });
        } else {    //Creation
            openmrsRest.create($scope.resource + "/mouvement", query).then(function (response) {
                toastr.success($translate.instant('Data saved successfully.'), 'Success');
                $state.go('home.movements');
                $scope.loading = false;
            }, function (e) {
                $scope.loading = false;
                console.log(e)
                toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
            });
        }
    }

    function showToast(msg, type) {
        $mdToast.show(
            $mdToast.simple()
                .content(msg)
                .theme(type + "-toast")
                .position('top right')
                .hideDelay(3000))
            .then(function () {
                $log.log($translate.instant('Toast dismissed.'));
            }).catch(function () {
                $log.log($translate.instant('Toast failed or was forced to close early by another toast.'));
            });
    }

}]);
