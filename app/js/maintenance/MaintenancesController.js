angular.module('MaintenancesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenancesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("History of Maintenances");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Maintenance Management": "History of Maintenances"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};
    $scope.maintenances = [];
    
    getAllMaintenances();

    function getAllMaintenances() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/maintenance").then(function (response) {
            $scope.loading = false;
            $scope.maintenances = response.results;
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllMaintenances()."), "error");
        });
    }
}]);