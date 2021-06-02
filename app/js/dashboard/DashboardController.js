angular.module('DashboardController', []).controller('DashboardController', ['$scope', '$rootScope', 'openmrsRest', function ($scope, $rootScope, openmrsRest) {
    $scope.rootscope = $rootScope;    
    console.log("DashboardController new form ---")
    $rootScope.links = {};
    $rootScope.links["Home"] = "";  
}]);