angular.module('DistrictsController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('DistrictsController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$q', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $q, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Sanitary District Management");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = { "GMAO Module": "", "Settings": "settings", "Sanitary District Management": "districts" };
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = { autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true };
    $scope.query = { limit: 50, page: 1, startIndex: 0, count: 0, order: '-id' };

    $scope.allRegions = [];
    $scope.allDistricts = [];
    $scope.district = {};

    $scope.clear = function () {
        $scope.district = {};
    }

    $scope.save = function () {
        if (($scope.district.code && $scope.district.code !== "") && ($scope.district.name && $scope.district.name !== "") && ($scope.district.regionid && $scope.district.regionid !== "")) {
            $scope.loading = true;
            if ($scope.district && $scope.district.uuid) {//edit
                openmrsRest.update($scope.resource + "/district", $scope.district).then(function (response) {
                    $scope.district = response;
                    loadAllDistricts();
                    toastr.success($translate.instant('The item has been successfully updated.'), 'Success');
                }, function (e) {
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/district", $scope.district).then(function (response) {
                    $scope.clear();
                    loadAllDistricts();
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

    $scope.read = function (district) {
        $scope.district = district;
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

    function deleteObject(district) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/district", district, "Generic Reason").then(function (response) {
            $scope.loading = false;
            loadAllDistricts();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
        }, function (e) {
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadAllDistricts() {
        $scope.loading = true;
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
        openmrsRest.getFull($scope.resource + "/district?limit=" + $scope.query.limit + "&startIndex=" + $scope.query.startIndex).then(function (response) {
            $scope.loading = false;
            $scope.allDistricts = response.results;
            openmrsRest.get($scope.resource + "/district/count").then(function (response) {
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

    loadAllOpenMRSRegions();
    loadAllDistricts();
}]);