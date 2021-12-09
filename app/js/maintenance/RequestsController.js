angular.module('RequestsController', ['ngMaterial', 'md.data.table']).controller('RequestsController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("History of Maintenance Requests");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Maintenance Management": "History of Maintenance Requests"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};
    $scope.requests = [];

    getAllRequests();

    function getAllRequests() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/maintenanceRequest").then(function (response) {
            $scope.loading = false;
            $scope.requests = response.results;
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllRequests()."), "error");
        });
    }
}]);