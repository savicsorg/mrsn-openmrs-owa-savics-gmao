angular.module('EquipmentsController', ['ngMaterial', 'md.data.table']).controller('EquipmentsController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Management of Equipements");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Equipments": "equipments"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};
    var dictionary = require("../utils/dictionary");
    $scope.equipmentStatus = dictionary.getEquipmentStatus($rootScope.selectedLanguage);
    $scope.getEquipmentStatusById = function (id) {
        return dictionary.getEquipmentStatusById(id, $rootScope.selectedLanguage);
    };
    $scope.equipments = [];
    
    getAllEquipments();

    function getAllEquipments() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
            $scope.loading = false;
            $scope.equipments = response.results;
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllEquipments()."), "error");
        });
    }

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
}]);