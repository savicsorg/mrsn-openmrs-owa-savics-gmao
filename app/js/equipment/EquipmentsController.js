angular.module('EquipmentsController', ['ngMaterial', 'md.data.table']).controller('EquipmentsController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $translate) {
        $scope.rootscope = $rootScope;
        $scope.appTitle = "Gestion des equipments";
        $scope.resource = "savicsgmao";
        $scope.loading = false;
        //Breadcrumbs properties
        $rootScope.links = {"Pharmacy management module": "", "Equipments": "equipments"};
        $scope.label = {
            page: $translate.instant("Page") + $translate.instant(":"),
            rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
            of: $translate.instant("of")
        }

        var dictionary = require("../utils/dictionary");
        $scope.equipmentStatus = dictionary.getEquipmentStatus($rootScope.selectedLanguage);

        var type = "";
        var msg = "";

        $scope.getAllEquipments = function () {
            $scope.loading = true;
            $scope.equipments = [];
            openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
                $scope.loading = false;
                if (response.results.length >= 1) {
                    $scope.equipments = response.results;
                }
            }, function (e) {
                $scope.loading = false;
                showToast($translate.instant("An unexpected error has occured."), "error");
            });
        }

        $scope.getAllEquipments();

        $scope.getEquipmentStatusById = function (id) {
            console.log("id = ", id)
            console.log(dictionary.getEquipmentStatusById(id, $rootScope.selectedLanguage))
            return dictionary.getEquipmentStatusById(id, $rootScope.selectedLanguage);
        };

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

        $scope.openEdit = function (data) {
            $state.go('home.equipment', {
                code: data.code,
                name: data.name,
                uuid: data.uuid,
                description: data.description,
                route: data.route,
                unit: data.unit,
                sellPrice: data.sellPrice,
                buyPrice: data.buyPrice,
                soh: data.soh,
                virtualstock: data.virtualstock,
                stockMax: data.stockMax,
                stockMin: data.stockMin
            });
        }

        $scope.search = function(item) {
            if (!$scope.searchAll || (item.id.toString().indexOf($scope.searchAll) != -1) || (item.designation && item.designation.toLowerCase().indexOf($scope.searchAll) != -1) || (item.serialNumber && item.serialNumber.toLowerCase().indexOf($scope.searchAll.toLowerCase()) != -1) ){
                return true;
            }
            return false;
        };

    }]);