angular.module('EquipmentTypesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('EquipmentTypesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Equipment Types Management");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Settings": "settings", "Equipment Types Management": "equipmentTypes"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};

    $scope.equipmentTypes = [];
    $scope.equipmentType = {};

    //equipmentTypes
    $scope.clear = function () {
        $scope.equipmentType = {};
    }

    $scope.save = function () {
        if($scope.equipmentType.name && $scope.district.name !== ""){
            $scope.loading = true;
            if ($scope.equipmentType && $scope.equipmentType.uuid) {//edit
                openmrsRest.update($scope.resource + "/equipmentType", $scope.equipmentType).then(function (response) {
                    loadEquipmentTypes();
                    toastr.success($translate.instant('Data removed successfully.'), 'Success');   
                },function(e){
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/equipmentType", $scope.equipmentType).then(function (response) {
                    loadEquipmentTypes();
                    toastr.success($translate.instant('Data removed successfully.'), 'Success');   
                },function(e){
                    console.error(e);
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            }
        } else {
            toastr.error($translate.instant('All required fields must be filled out.'), 'Error');
        }
    }

    $scope.delete = function (equipmentType) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/equipmentType", equipmentType, "Generic Reason").then(function (response) {
            loadEquipmentTypes();
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadEquipmentTypes() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/equipmentType").then(function (response) {
            $scope.equipmentTypes = response.results;
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    loadEquipmentTypes();

    $scope.read = function (equipmentType) {
        $scope.equipmentType = equipmentType;
    }
}]);