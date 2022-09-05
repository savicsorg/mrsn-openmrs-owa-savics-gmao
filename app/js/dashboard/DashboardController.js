angular.module('DashboardController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('DashboardController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    var _ = require("underscore");
    var moment = require('moment');
    $scope.rootScope = $rootScope;
    $scope.appTitle = "Module GMAO";
    $scope.resource = "savicsgmao";
    //Breadcrumbs properties
    $rootScope.links = { "Module GMAO": "" };
    $scope.hasPendingRequest = false;
    $scope.todoFutureMaintenances = 0;
    $scope.todoPassMaintenances = 0;
    $scope.requestMaintenances = 0;
    function getAllRequests() {
        openmrsRest.getFull($scope.resource + "/maintenanceRequest").then(function (response) {
            let requests = response.results;
            let evens = _.filter(requests, function (obj) {
                return obj.status == null || obj.status == "VALID" || obj.status == "INIT";
            });
            $scope.hasPendingRequest = (evens.length >= 1) ? true : false;
            $scope.requestMaintenances = evens.length;
        }, function (e) {
            showToast($translate.instant("An unexpected error has occured with getAllRequests()."), "error");
        });
    }
    getAllRequests();
    
    function getAllTodoMaintenances() {
        openmrsRest.getFull($scope.resource + "/maintenance").then(function (response) {
            let maintenances = response.results;
            
            let evens = _.filter(maintenances, function (obj) {
                obj.dueDate = new Date(moment(new Date(obj.dueDate)).format('MM/DD/YYYY, h:mm A'));
                return obj.status === 0 && obj.dueDate >= new Date();
            });
            $scope.todoFutureMaintenances = evens.length;
            
            evens = _.filter(maintenances, function (obj) {
                obj.dueDate = new Date(moment(new Date(obj.dueDate)).format('MM/DD/YYYY, h:mm A'));
                return obj.status === 0 && obj.dueDate < new Date();
            });
            $scope.todoPassMaintenances = evens.length;
            console.log($scope.todoPassMaintenances, $scope.todoFutureMaintenances)
        }, function (e) {
            showToast($translate.instant("An unexpected error has occured with getAllRequests()."), "error");
        });
    }
    getAllTodoMaintenances();

    $scope.hideWarning = function () {
        $scope.hasPendingRequest = false;
    }

}]);