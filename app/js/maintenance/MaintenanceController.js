angular.module('MaintenanceController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenanceController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
        $scope.rootscope = $rootScope;
    
    console.log("MaintenanceController new form ---")
    $scope.myAgents = [{}];
    $scope.appTitle = "Gestion des maintenances";
    $scope.resource = "savicsgmao/agent";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Maintenance"] = "/maintenance";
    
    loadAgents();

    function loadAgents() {
        openmrsRest.getFull("savicsgmao/agent").then(function (response) {
            $scope.showLoading = false;
            $scope.agents = response.results;
        })
    }
}]);
