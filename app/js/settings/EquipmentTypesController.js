angular.module('EquipmentTypesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('EquipmentTypesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Equipment Types Management");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"Module GMAO": "", "Settings": "settings", "Equipment Types Management": "equipmentTypes"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1, order:'-id'};

    $scope.equipmentTypes = [];
    $scope.equipmentType = {};

    //equipmentTypes
    $scope.clear = function () {
        $scope.equipmentType = {};
    }

    $scope.save = function () {
        if($scope.equipmentType.name){
            $scope.loading = true;
            if ($scope.equipmentType && $scope.equipmentType.uuid) {//edit
                openmrsRest.update($scope.resource + "/equipmentType", $scope.equipmentType).then(function (response) {
                    loadEquipmentTypes();
                    toastr.success($translate.instant('The item has been successfully updated.'), 'Success');
                },function(e){
                    console.error(e, "openmrsRest.update()");
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            } else {//Creation
                openmrsRest.create($scope.resource + "/equipmentType", $scope.equipmentType).then(function (response) {
                    $scope.clear();
                    loadEquipmentTypes();
                    toastr.success($translate.instant('The item has been successfully created.'), 'Success');
                },function(e){
                    console.error(e, "openmrsRest.create()");
                    $scope.loading = false;
                    toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
                });
            }
        } else {
            toastr.error($translate.instant('All required fields must be filled out.'), 'Error');
        }
    }

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

    function deleteObject(equipmentType) {
        console.log(equipmentType)
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/equipmentType", equipmentType, "Generic Reason").then(function (response) {
            $scope.loading = false;
            loadEquipmentTypes();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
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