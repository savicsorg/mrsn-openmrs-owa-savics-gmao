angular.module('HealthCentersController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('HealthCentersController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
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
    $scope.query = {limit: 5, page: 1};

    $scope.regions = [];
    $scope.districts = [];
    $scope.healthCenters = [];
    $scope.healthCenter = {};

    //healthCenters
    $scope.clear = function () {
        $scope.healthCenter = {};
    }

    $scope.save = function () {
        if(($scope.healthCenter.code && $scope.healthCenter.code !== "") && ($scope.healthCenter.name && $scope.healthCenter.name !== "") && ($scope.healthCenter.district)){
            $scope.loading = true;
            if ($scope.healthCenter && $scope.healthCenter.uuid) {//edit
                openmrsRest.update($scope.resource + "/healthcenter", $scope.healthCenter).then(function (response) {
                    loadHealthCenters();
                    toastr.success($translate.instant('Data removed successfully.'), 'Success');   
                },function(e){
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/healthcenter", $scope.healthCenter).then(function (response) {
                    loadHealthCenters();
                    toastr.success($translate.instant('Data removed successfully.'), 'Success');   
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

    $scope.delete = function (healthCenter) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/healthcenter", healthCenter, "Generic Reason").then(function (response) {
            loadHealthCenters();
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadHealthCenters() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/healthcenter").then(function (response) {
            $scope.healthCenters = response.results;
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadOpenMRSRegions() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/addressHierarchy?level=2").then(function (response) {
            $scope.loading = false;
            $scope.regions = response.results;
        },function(e){
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadDistricts() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/district").then(function (response) {
            $scope.loading = false;
            $scope.districts = response.results;
        },function(e){
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadOpenMRSRegions();
    loadDistricts();
    loadHealthCenters();

    $scope.read = function (healthCenter) {
        $scope.healthCenter = healthCenter;
    }
}]);