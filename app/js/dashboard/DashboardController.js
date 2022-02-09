angular.module('DashboardController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('DashboardController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var _ = require("underscore");
    $scope.rootScope = $rootScope;
    $scope.appTitle = "Module GMAO";
    $scope.resource = "savicsgmao";
    //Breadcrumbs properties
    $rootScope.links = { "Module GMAO": "" };
    $scope.hasPendingRequest = false;
    function getAllRequests() {
        openmrsRest.getFull($scope.resource + "/maintenanceRequest").then(function (response) {
            let requests = response.results;
            let evens = _.filter(requests, function (obj) {
                return obj.status == null || obj.status == "VALID" || obj.status == "INIT";
            });
            $scope.hasPendingRequest = (evens.length >= 1) ? true : false;
        }, function (e) {
            showToast($translate.instant("An unexpected error has occured with getAllRequests()."), "error");
        });
    }
    getAllRequests();

    $scope.hideWarning = function () {
        $scope.hasPendingRequest = false;
    }

}]);