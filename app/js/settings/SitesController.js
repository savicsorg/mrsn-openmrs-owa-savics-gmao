angular.module('SitesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('SitesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Sites in the HD/CSI service");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Settings": "settings", "Sites in the HD/CSI service": "sites"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};

    $scope.sites = [];
    $scope.site = {district:{}};

    $scope.clear = function () {
        $scope.site = {district:{}};
    }

    $scope.save = function () {
        if(($scope.site.code && $scope.site.code !== "") && ($scope.site.name && $scope.site.name !== "") && $scope.site.service){
            $scope.loading = true;
            $scope.site.district = parseInt($scope.site.district.id);
            if ($scope.site && $scope.site.uuid) {//edit
                openmrsRest.update($scope.resource + "/site", $scope.site).then(function (response) {
                    $scope.loading = false;
                    $scope.site = response;
                    loadSiteLocations() ;
                    toastr.success($translate.instant('Data removed successfully.'), 'Success');   
                },function(e){
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/site", $scope.site).then(function (response) {
                    $scope.loading = false;
                    $scope.site = response;
                    loadSiteLocations() ;
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

    $scope.delete = function (site) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/site", site, "Generic Reason").then(function (response) {
            $scope.loading = false;
            loadSiteLocations() ;
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadSiteLocations() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/site").then(function (response) {
            $scope.loading = false;
            $scope.sites = response.results;
        },function(e){
            $scope.loading = false;
            console.error(e);
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadSiteLocations();

    $scope.read = function (site) {
        $scope.site = site;
    }
}]);