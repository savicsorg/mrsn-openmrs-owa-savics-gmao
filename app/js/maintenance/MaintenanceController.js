angular.module('MaintenanceController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenanceController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Perform a Maintenance");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Maintenance Management": "maintenancemanagement"};
}]);