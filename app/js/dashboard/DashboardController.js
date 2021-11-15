angular.module('DashboardController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('DashboardController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
        $scope.rootscope = $rootScope;
    
    console.log("DashboardController new form ---")
    $scope.myAgents = [{}];
    $scope.appTitle = "Gestion des equipements";
    $scope.resource = "savicsgmao/agent";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Agents"] = "/agents";   
}]);