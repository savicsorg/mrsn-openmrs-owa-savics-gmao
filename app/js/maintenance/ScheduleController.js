angular.module('ScheduleController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('ScheduleController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;

    $scope.maintenances = [];
    $scope.appTitle = "Schedule a maintenance";
    $scope.resource = "savicsgmao";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Maintenance"] = "/maintenance";
    
}]);