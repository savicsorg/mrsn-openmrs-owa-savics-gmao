angular.module('EquipmentController' ['ngMaterial','ngAnimate', 'toastr']).controller('EquipmentController', ['$scope', '$rootScope', '$state', '$stateParams', 'openmrsRest','toastr', function ($scope, $rootScope, $state, $stateParams, openmrsRest, toastr) {
    $scope.rootscope = $rootScope;
    console.log("EquipmentController new form ---")
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Equipments"] = "/equipments";
    $scope.equipement = { department:{}, equipmentType:{} };

    $scope.resource = "savicsgmao";
    $scope.departments = [];
    $scope.equipmentTypes = [];
    $scope.equipments = [];

    function loadLookUps(callback) {
        openmrsRest.getFull($scope.resource + "/equipmentType").then(function (response) {
            $scope.equipmentTypes = response.results;
            openmrsRest.getFull($scope.resource + "/department").then(function (response) {
                $scope.departments = response.results;     
                callback(null,response.results);          
            });
        });
    }

    function loadEquipment(uuid, callback) {
        openmrsRest.getFull($scope.resource + "/equipment/" + uuid).then(function (response) {
            $scope.equipment = response.results;     
            callback(null, response.results);          
        }, function(e){
            callback(e, null);      
        });
    }

    function loadEquipments(callback) {
        openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
            $scope.equipments = response.results;     
            callback(null, response.results);          
        }, function(e){
            callback(e, null);      
        });
    }

    if($stateParams.equipment && $stateParams.equipment.id){
        $scope.equipment = $stateParams.equipment;
    } else {
        loadLookUps(function(e,data){
            if(e){
                toastr.error('An unexpected error has occured.', 'Error');
                $scope.loading = false;
            }                
            else {
                loadEquipments(function(e1, data1){
                    if(e){
                        toastr.error('An unexpected error has occured.', 'Error');
                        $scope.loading = false;
                    }
                    else {
                        toastr.success('Data saved successfully.', 'Success'); 
                        $scope.loading = false;
                    } 
                });
            }                         
        });
    }  

    $scope.view = function (equipment) {
        $state.go('home.equipment', { equipment: equipment });
    }

    $scope.saveEquipment = function () {
        $scope.loading = true;
        if ($scope.equipment && $scope.equipment.uuid) {//edit
            console.log("Updating the equipment ", $scope.equipment.uuid)
            openmrsRest.update($scope.ressource + "equipment", $scope.equipment).then(function (response) {
                console.log(response);
                loadEquipments();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new equipment ")
            openmrsRest.create($scope.ressource + "equipment", $scope.equipment).then(function (response) {
                console.log(response);
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
