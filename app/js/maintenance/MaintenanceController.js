angular.module('MaintenanceController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenanceController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) { 
    $scope.rootscope = $rootScope;
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    $rootScope.links = {"GMAO Module": "", "Maintenance Management": "maintenancemanagement"};
    $scope.maintenance = {};
    $scope.equipment = {};
    $scope.item = null;
    $scope.searchText = "";

    $scope.getData = function () {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/maintenanceType").then(function (response) {
            $scope.maintenance_types = response.results;
            openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
                $scope.equipments = response.results;
                if($stateParams.uuid){
                    openmrsRest.getFull($scope.resource + "/maintenance/" + $stateParams.uuid).then(function (response) {
                        $scope.loading = false;
                        $scope.maintenance = response;
                        $scope.searchText = $scope.maintenance.equipment.name;                      
                    },function(e){
                        $scope.loading = false;
                        toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                    });
                } else $scope.loading = false;
            },function(e){
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
            });
        },function(e){
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
        });       
    }

    $scope.save = function(){
        $scope.loading = true;
        var query = JSON.parse(JSON.stringify($scope.maintenance));
        query.unit = query.unit.id;
        query.route = query.route.id;
        openmrsRest.getFull($scope.resource + "/item?code=" + $scope.drug.code).then(function (response) {
            if (response.results.length == 0 || (response.results[0].uuid == $scope.drug.uuid)) {                
                if ($scope.drug && $scope.drug.uuid) {    //Edit
                    openmrsRest.update($scope.resource + "/item", query).then(function (response) {
                        $scope.drug = response;
                        $scope.getData();
                        $state.go('home.drugs', { });  
                    },function(e){
                        $scope.loading = false;
                        toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                    });
                } else {    //Creation
                    openmrsRest.create($scope.resource + "/item", query).then(function (response) {
                        $scope.drug = response;
                        $scope.getData();
                        $state.go('home.drugs', { });  
                    },function(e){
                        $scope.loading = false;
                        toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                    });
                }
            } else {
                $mdDialog.show($mdDialog.alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .textContent($translate.instant('Attention, the drug code you entered is already used. Please use another one.'))
                .ok('Ok')).then(function(){
                    $scope.getData();
                    $scope.loading = false;
                });
            }
        });
    }

    $scope.getEquipments = function (searchText) {
        return openmrsRest.getFull("equipment?name=" + searchText).then(function (response) {
            return response.results;
        });
    };

    $scope.selectedEquipmentChange = function (item) {
        if (item) {
            $scope.equipment = item;
        }
    }

    $scope.getData();

}]);