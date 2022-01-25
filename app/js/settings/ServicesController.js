angular.module('ServicesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('ServicesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$q', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $q, $translate) {
    var _ = require("underscore");
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Services in HD/CSI");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = { "GMAO Module": "", "Settings": "settings", "Services in HD/CSI": "services" };
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
    $scope.allServices = [];
    $scope.service = {};

    $scope.clear = function () {
        $scope.service = {};
    }

    $scope.save = function () {
        if (($scope.service.code && $scope.service.code !== "") && ($scope.service.name && $scope.service.name !== "") && $scope.service.healthcenterId) {
            $scope.loading = true;
            $scope.service.healthcenter = $scope.service.healthcenterId;
            if ($scope.service && $scope.service.uuid) {//edit
                openmrsRest.update($scope.resource + "/service", $scope.service).then(function (response) {
                    loadAllServices();
                    toastr.success($translate.instant('The item has been successfully updated.'), 'Success');
                }, function (e) {
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/service", $scope.service).then(function (response) {
                    $scope.clear();
                    loadAllServices();
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

    function deleteObject(service) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/service", service, "Generic Reason").then(function (response) {
            $scope.loading = false;
            loadAllServices();
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
            $scope.loading = false;
            allHealthCenters = response.results;
        }, function (e) {
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadAllServices() {
        $scope.loading = true;
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
        openmrsRest.getFull($scope.resource + "/service").then(function (response) {
            $scope.allServices = response.results;
            $scope.loading = false;
            openmrsRest.get($scope.resource + "/service/count").then(function (response) {
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
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadAllOpenMRSRegions();
    loadAllDistricts();
    loadAllHealthCenters();
    loadAllServices();

    $scope.read = function (service) {
        let data = service.healthcenter;
        $scope.service = service;
        $scope.service.regionid = data.district.regionid;
        $scope.regionChanged(data.district.id);
        $scope.service.district = data.district.id;
        $scope.service.healthcenterId = data.id;
        $scope.districtChanged(data.id);
    }

    $scope.regionChanged = function (type) {
        if (type == "html") {
            $scope.service.district = undefined;
            $scope.service.healthcenter = undefined;
        }
        $scope.districts = [];
        $scope.healthCenters = [];
        $scope.districts = _.where(allDistricts, { regionid: $scope.service.regionid });
    }

    $scope.districtChanged = function (type) {
        if (type == "html") {
            $scope.service.healthcenter = undefined;
        }
        $scope.healthCenters = [];
        $scope.healthCenters = _.filter(allHealthCenters, function (item) {
            return item.district.id === $scope.service.district;
        });
    }
}]);