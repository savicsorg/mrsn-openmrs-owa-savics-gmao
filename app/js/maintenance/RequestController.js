angular.module('RequestController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('RequestController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;

    $scope.maintenances = [];
    $scope.appTitle = "Request an intervention";
    $scope.resource = "savicsgmao";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Maintenance"] = "/maintenance";
    
}]);