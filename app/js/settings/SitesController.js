angular.module('SitesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('SitesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$q', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $q, $translate) {
    var _ = require("underscore");
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Sites in the HD/CSI service");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = { "GMAO Module": "", "Settings": "settings", "Sites in the HD/CSI service": "sites" };
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = { autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true };
    $scope.query = { limit: 50, page: 1, startIndex: 0, count: 0, order: '-id' };

    $scope.allRegions = [];
    var allDistricts = [];
    $scope.districts = [];
    var allHealthCenters = [];
    $scope.healthCenters = [];
    var allServices = [];
    $scope.services = [];
    $scope.sites = [];
    $scope.site = { district: {} };

    $scope.clear = function () {
        $scope.site = { district: {} };
    }

    $scope.save = function () {
        if (($scope.site.code && $scope.site.code !== "") && ($scope.site.name && $scope.site.name !== "") && $scope.site.serviceId) {
            $scope.loading = true;
            $scope.site.service = $scope.site.serviceId;
            $scope.site.district = parseInt($scope.site.district.id);
            if ($scope.site && $scope.site.uuid) {//edit
                openmrsRest.update($scope.resource + "/site", $scope.site).then(function (response) {
                    $scope.site = response;
                    loadAllSites();
                    toastr.success($translate.instant('The item has been successfully updated.'), 'Success');
                }, function (e) {
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/site", $scope.site).then(function (response) {
                    $scope.clear();
                    loadAllSites();
                    toastr.success($translate.instant('The item has been successfully created.'), 'Success');
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

    $scope.delete = function (ev, obj) {
        var confirm = $mdDialog.confirm()
            .title($translate.instant('Are you sure you want to delete this item?'))
            .textContent($translate.instant('If you choose `YES` this item will be deleted and you will not be able to recover it.'))
            .ariaLabel($translate.instant('Delete Confirmation'))
            .targetEvent(ev)
            .ok($translate.instant('Yes'))
            .cancel($translate.instant('Cancel'));
        $mdDialog.show(confirm).then(function () {
            deleteObject(obj);
        }, function () {
            $mdDialog.cancel();
        });
    };

    function deleteObject(site) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/site", site, "Generic Reason").then(function (response) {
            $scope.loading = false;
            loadAllSites();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
        }, function (e) {
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
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
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
        openmrsRest.getFull($scope.resource + "/site").then(function (response) {
            $scope.loading = false;
            $scope.allSites = response.results;
            openmrsRest.get($scope.resource + "/site/count").then(function (response) {
                if (response.count) {
                    $scope.query.count = response.count;
                }
                $rootScope.kernel.loading = 100;
                deferred.resolve(response.results);
            }, function (e) {
                $scope.loading = false;
                showToast($translate.instant("An unexpected error has occured."), "error");
            });
        }, function (e) {
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadAllOpenMRSRegions();
    loadAllDistricts();
    loadAllHealthCenters();
    loadAllServices();
    loadAllSites();

    $scope.read = function (site) {
        let data = site.service;
        $scope.site = site;
        $scope.site.serviceId = data.id;
        $scope.site.healthcenter = data.healthcenter.id;
        $scope.site.district = data.healthcenter.district.id;
        $scope.site.regionid = data.healthcenter.district.regionid;
        $scope.regionChanged();
        $scope.districtChanged();
        $scope.healthCenterChanged();
    }

    $scope.regionChanged = function (type) {
        if (type == "html") {
            $scope.site.district = undefined;
            $scope.site.healthcenter = undefined;
            $scope.site.service = undefined;
        }

        $scope.healthCenters = [];
        $scope.services = [];
        $scope.districts = [];
        $scope.districts = _.where(allDistricts, { regionid: $scope.site.regionid });
    }

    $scope.districtChanged = function (type) {
        if (type == "html") {
            $scope.site.healthcenter = undefined;
            $scope.site.service = undefined;
        }
        $scope.services = [];
        $scope.healthCenters = [];
        $scope.healthCenters = _.filter(allHealthCenters, function (item) {
            return item.district.id === $scope.site.district;
        });
    }

    $scope.healthCenterChanged = function (type) {
        if (type == "html") {
            $scope.site.service = undefined;
        }
        $scope.services = [];
        $scope.services = _.filter(allServices, function (item) {
            return item.healthcenter.id === $scope.site.healthcenter;
        });
    }
}]);