angular.module('ServicesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('ServicesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Services in HD/CSI");
    $scope.resource = "savicsgmao/district";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Settings": "settings", "Services in HD/CSI": "services"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};

    $scope.services = [];
    $scope.service = {};

    //services
    $scope.clear = function () {
        $scope.service = {};
    }

    $scope.save = function () {
        $scope.loading = true;
        if ($scope.service && $scope.service.uuid) {//edit
            openmrsRest.update($scope.resource, $scope.service).then(function (response) {
                loadHealthCenters();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {//Creation
            openmrsRest.create($scope.resource, $scope.service).then(function (response) {
                loadHealthCenters();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }
    }

    $scope.delete = function (service) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource, service, "Generic Reason").then(function (response) {
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
        openmrsRest.getFull($scope.resource).then(function (response) {
            $scope.services = response.results;
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadHealthCenters();

    $scope.read = function (service) {
        $scope.service = service;
    }
}]);