angular.module('DashboardController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('DashboardController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;
    $scope.appTitle = "GMAO Module";
    $scope.resource = "savicsgmao";
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": ""};
}]);