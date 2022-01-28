angular.module('MaintenanceManagementController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenanceManagementController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Maintenance Management");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"Module GMAO": "", "Maintenance Management": ""};
}]);