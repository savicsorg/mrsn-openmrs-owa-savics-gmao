angular.module('EquipmentController', []).controller('EquipmentController', ['$scope', '$rootScope', '$state', '$stateParams', 'openmrsRest', function ($scope, $rootScope, $state, $stateParams, openmrsRest) {
    $scope.rootscope = $rootScope;
    console.log("EquipmentController new form ---")
    //Breadcrumbs properties
    $scope.ressource = "savicsgmao/";
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Equipments"] = "equipments";
    $scope.equipment = { department: {}, equipmentType: {} };

    $scope.resource = "savicsgmao";
    $scope.departments = [];
    $scope.equipmentTypes = [];
    $scope.equipments = [];
    $scope.loading = false;

    function loadEquipments() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/equipmentType").then(function (response) {
            $scope.equipmentTypes = response.results;
            openmrsRest.getFull($scope.resource + "/department").then(function (response) {
                $scope.departments = response.results;     
                openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
                    $scope.equipments = response.results;     
                    $scope.loading = false; 
                }, function(e){
                    $scope.loading = false;       
                });
            });
        });
    }

    loadEquipments();

    $scope.view = function (equipment) {
        $state.go('home.equipment', { equipment: equipment });
    }

    $scope.saveEquipment = function () {
        $scope.loading = true;
        if ($scope.equipment && $scope.equipment.uuid) {    //Edit
            console.log("Updating the equipment ", $scope.equipment.uuid)
            openmrsRest.update($scope.ressource + "equipment", $scope.equipment).then(function (response) {
                console.log(response);
                $scope.equipment = response;
                loadEquipments();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {    //Creation
            console.log("Creating new equipment ")
            openmrsRest.create($scope.ressource + "equipment", $scope.equipment).then(function (response) {
                console.log(response);
                $scope.equipment = response;
                loadEquipments();
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
        openmrsRest.remove($scope.ressource + "equipment", equipment, "Generic Reason").then(function (response) {
            console.log(response);
            loadEquipments();
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }
}]);
