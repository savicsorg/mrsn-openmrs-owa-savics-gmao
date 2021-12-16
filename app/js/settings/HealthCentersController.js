angular.module('HealthCentersController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('HealthCentersController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var _ = require("underscore");
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("HD/CSIs Management");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Settings": "settings", "HD/CSI Management": "healthCenters"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1, order:'-id'};

    $scope.allRegions = [];
    var allDistricts = [];
    $scope.districts = [];
    $scope.allHealthCenters = [];
    $scope.healthCenter = {};

    $scope.clear = function () {
        $scope.healthCenter = {};
    }

    $scope.save = function () {
        if(($scope.healthCenter.code && $scope.healthCenter.code !== "") && ($scope.healthCenter.name && $scope.healthCenter.name !== "") && $scope.healthCenter.district){
            $scope.loading = true;
            if ($scope.healthCenter && $scope.healthCenter.uuid) {//edit
                openmrsRest.update($scope.resource + "/healthcenter", $scope.healthCenter).then(function (response) {
                    loadAllHealthCenters();
                    toastr.success($translate.instant('The item has been successfully updated.'), 'Success');
                },function(e){
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/healthcenter", $scope.healthCenter).then(function (response) {
                    $scope.clear();
                    loadAllHealthCenters();
                    toastr.success($translate.instant('The item has been successfully created.'), 'Success');
                },function(e){
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

    function deleteObject(healthcenter) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/healthcenter", healthcenter, "Generic Reason").then(function (response) {
            $scope.loading = false;
            loadAllHealthCenters();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
        },function(e){
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
        },function(e){
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
        },function(e){
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadAllHealthCenters() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/healthcenter").then(function (response) {
            $scope.loading = false;
            $scope.allHealthCenters = response.results;
        },function(e){
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadAllOpenMRSRegions();
    loadAllDistricts();
    loadAllHealthCenters();

    $scope.read = function (healthCenter) {
        $scope.healthCenter = healthCenter;
    }

    $scope.regionChanged = function(){
        $scope.healthCenter.district = undefined;
        $scope.districts = [];
        $scope.districts = _.where(allDistricts, {regionid: $scope.healthCenter.regionid});
    }
}]);