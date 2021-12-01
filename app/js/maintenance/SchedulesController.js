angular.module('SchedulesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('SchedulesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;

    $scope.maintenances = [];
    $scope.appTitle = "Historique des planifications";
    $scope.resource = "savicsgmao/maintenance";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Maintenances"] = "/maintenances";
    $scope.label = {
        page: $translate.instant("Page")  + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};
    
    loadSchedules();

    function loadSchedules() {
        openmrsRest.getFull("savicsgmao/maintenance").then(function (response) {
            $scope.showLoading = false;
            $scope.schedules = response.results;
        })
    }
}]);