angular.module('MaintenancesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenancesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("History of Maintenances");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Maintenance Management": "History of Maintenances"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1, order:'-id'};
    $scope.maintenances = [];

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

    function deleteObject(maintenance) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/maintenance", maintenance, "Generic Reason").then(function (response) {
            $scope.loading = false;
            getAllMaintenances();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function getAllMaintenances() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/maintenance").then(function (response) {
            $scope.loading = false;
            $scope.maintenances = response.results;
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllMaintenances()."), "error");
        });
    }

    getAllMaintenances();
    
    

    $scope.donwload = function () {
        let link = window.location.protocol + "//" + window.location.host + "/openmrs/ws/rest/v1/savicsgmao/maintenances/export";
        localStorage.setItem("export_link", link);
        window.location = link;
    }
}]);