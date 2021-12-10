angular.module('DistrictsController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('DistrictsController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Sanitary District Management");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Settings": "settings", "Sanitary District Management": "districts"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};

    $scope.districts = [];
    $scope.district = {region:{}};

    //district
    $scope.clear = function () {
        $scope.district = {region:{}};
    }

    $scope.save = function () {
        $scope.loading = true;
        $scope.district.region = parseInt($scope.district.region.id);
        if ($scope.district && $scope.district.uuid) {//edit
            openmrsRest.update($scope.resource + "/district", $scope.district).then(function (response) {
                $scope.district = response;
                loadDistricts();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {//Creation
            openmrsRest.create($scope.resource + "/district", $scope.district).then(function (response) {
                $scope.district = response;
                loadDistricts();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }
    }

    $scope.read = function (district) {
        $scope.district = district;
    }

    $scope.delete = function (district) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/district", district, "Generic Reason").then(function (response) {
            loadDistricts();
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
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

    loadDistricts();
}]);