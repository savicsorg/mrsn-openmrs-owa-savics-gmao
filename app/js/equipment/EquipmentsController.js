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
    
    $scope.delete = function (ev, obj) {
        var confirm = $mdDialog.confirm()
            .title($translate.instant('Are you sure you want to delete this item?'))
            .textContent($translate.instant('If you choose `YES` this item will be deleted and you will not be able to recover it.'))
            .ariaLabel($translate.instant('Delete Confirmation'))
            .targetEvent(ev)
            .ok($translate.instant('Yes'))
            .cancel($translate.instant('Cancel'));
        $mdDialog.show(confirm).then(function () {
            deleteObject(obj);
        }, function () {
            $mdDialog.cancel();
        });
    };

    function deleteObject(equipment) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/equipment", equipment, "Generic Reason").then(function (response) {
            $scope.loading = false;
            getAllEquipments();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
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

    getAllEquipments();
}]);