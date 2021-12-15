angular.module('ServicesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('ServicesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Services in HD/CSI");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Settings": "settings", "Services in HD/CSI": "services"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1, order:'-id'};

    $scope.regions = [];
    $scope.districts = [];
    $scope.healthCenters = [];
    $scope.services = [];
    $scope.service = {};

    //services
    $scope.clear = function () {
        $scope.service = {};
    }

    $scope.save = function () {
        if(($scope.service.code && $scope.service.code !== "") && ($scope.service.name && $scope.service.name !== "") && $scope.service.healthcenter){
            $scope.loading = true;
            if ($scope.service && $scope.service.uuid) {//edit
                openmrsRest.update($scope.resource + "/service", $scope.service).then(function (response) {
                    loadServices();
                    toastr.success($translate.instant('The item has been successfully updated.'), 'Success');
                },function(e){
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/service", $scope.service).then(function (response) {
                    $scope.clear();
                    loadServices();
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

    function deleteObject(service) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/service", service, "Generic Reason").then(function (response) {
            $scope.loading = false;
            loadServices();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
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

    function loadServices() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/service").then(function (response) {
            $scope.services = response.results;
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadOpenMRSRegions();
    loadDistricts();
    loadHealthCenters();
    loadServices();

    $scope.read = function (service) {
        $scope.service = service;
    }
}]);