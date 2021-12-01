angular.module('RequestsController', ['ngMaterial', 'md.data.table']).controller('RequestsController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $translate) {
        $scope.rootscope = $rootScope;
        $scope.appTitle = $translate.instant("History of interventions");
        $scope.resource = "savicsgmao";
        $scope.loading = false;
        //Breadcrumbs properties
        $rootScope.links = {"GMAO module": "", "History of interventions": "requests"};
        $scope.label = {
            page: $translate.instant("Page") + $translate.instant(":"),
            rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
            of: $translate.instant("of")
        }

        var dictionary = require("../utils/dictionary");
        var priorities = require('../../json/maintenance/priority.json');
        
        $scope.getEquipmentStatusById = function (id) {
            return dictionary.getElementById(priorities, id, $rootScope.selectedLanguage);
        };

        var type = "";
        var msg = "";

        $scope.getAllRequests = function () {
            $scope.loading = true;
            $scope.requests = [];
            openmrsRest.getFull($scope.resource + "/maintenanceRequest").then(function (response) {
                $scope.loading = false;
                if (response.results.length >= 1) {
                    $scope.requests = response.results;
                }
            }, function (e) {
                $scope.loading = false;
                showToast($translate.instant("An unexpected error has occured."), "error");
            });

        }

        $scope.getAllRequests();


        $scope.options = {
            autoSelect: true,
            boundaryLinks: false,
            largeEditDialog: true,
            pageSelector: true,
            rowSelection: true
        };

        $scope.query = {
            limit: 25,
            page: 1
        };

        $scope.search = function (item) {
            if (!$scope.searchAll || (item.id.toString().indexOf($scope.searchAll) != -1) || (item.equipment.designation && item.equipment.designation.toLowerCase().indexOf($scope.searchAll) != -1)) {
                return true;
            }
            return false;
        };
    }]);
