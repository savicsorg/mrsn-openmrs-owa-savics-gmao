angular.module('EquipmentController', ['ngMaterial','ngAnimate', 'toastr']).controller('EquipmentController', ['$scope', '$rootScope', '$state', '$stateParams', 'openmrsRest', 'toastr', function ($scope, $rootScope, $state, $stateParams, openmrsRest, toastr) {
    $scope.rootscope = $rootScope;
    console.log("EquipmentController new form ---")
    //Breadcrumbs properties
    $scope.resource = "savicsgmao";
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Equipments"] = "equipments";
    $scope.equipment = { department: {}, equipmentType: {} };
    $scope.departments = [];
    $scope.equipmentTypes = [];
    $scope.equipments = [];
    $scope.loading = false;

    function loadData() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/equipmentType").then(function (response) {
            $scope.equipmentTypes = response.results;
            openmrsRest.getFull($scope.resource + "/department").then(function (response) {
                $scope.departments = response.results;  
                console.log($stateParams);
                if($stateParams.equipment){
                    $scope.equipment = $stateParams.equipment;
                    $scope.loading = false; 
                }   else {
                    openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
                        $scope.equipments = response.results;     
                        $scope.loading = false; 
                    },function(e){
                        console.error(e);
                        $scope.loading = false;
                        toastr.error('An unexpected error has occured.', 'Error');
                    });
                }
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    loadData();

    $scope.view = function (equipment) {
        equipment.acquisitionDate = new Date(equipment.acquisitionDate);
        $state.go('home.equipment', { equipment: equipment });
    }

    $scope.movement = function (equipment) {
        $state.go('home.operation', { equipment: equipment });
    }

    $scope.maintenance = function (equipment) {
        $state.go('home.maintenance', { equipment: equipment });
    }

    $scope.saveEquipment = function () {
        $scope.loading = true;
        if(!$scope.equipment.equipmentStatus) $scope.equipment.equipmentStatus = 1;
        if(!$scope.equipment.providerId) $scope.equipment.providerId = 1;
        $scope.equipment.acquisitionDate = new Date($scope.equipment.acquisitionDate);
        $scope.equipment.department = $scope.equipment.department.id;
        $scope.equipment.equipmentType = $scope.equipment.equipmentType.id;
        if ($scope.equipment && $scope.equipment.uuid) {    //Edit
            console.log("Updating the equipment ", $scope.equipment.uuid)
            openmrsRest.update($scope.resource + "/equipment", $scope.equipment).then(function (response) {
                console.log(response);
                response.acquisitionDate = new Date(response.acquisitionDate);
                $scope.equipment = response;
                loadData();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {    //Creation
            console.log("Creating new equipment ")
            openmrsRest.create($scope.resource + "/equipment", $scope.equipment).then(function (response) {
                console.log(response);
                response.acquisitionDate = new Date(response.acquisitionDate);
                $scope.equipment = response;
                loadData();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    $scope.deleteEquipment = function (equipment) {
        $scope.loading = true;
        console.log(equipment)
        openmrsRest.remove($scope.resource + "/equipment", equipment, "Generic Reason").then(function (response) {
            console.log(response);
            loadData();
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }
}]);
