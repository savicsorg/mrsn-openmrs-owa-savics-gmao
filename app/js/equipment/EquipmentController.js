angular.module('EquipmentController', []).controller('EquipmentController', ['$scope', '$rootScope', '$state', '$stateParams', 'openmrsRest', function ($scope, $rootScope, $state, $stateParams, openmrsRest) {
    $scope.rootscope = $rootScope;
    
    console.log("EquipmentController new form ---")
    $scope.appTitle = "Gestion des equipements";
    $scope.resource = "savicsgmao/agent";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Equipments"] = "/equipements";
    $scope.equipement = {};
    
    $scope.appTitle = "Gestion des equipements";
    $scope.resource = "savicsgmao/agent";
    $scope.departments = [
        { department_id: 1, name: 'Department 1'},
        { department_id: 2, name: 'Department 2'}
    ];
    $scope.equipmentTypes = [
        { equipment_type_id: 1, name: 'Type 1'},
        { equipment_type_id: 2, name: 'Type 2'}
    ];

    
    //TODO replace this by real data comming from openmrsRest
    $scope.equipements = [
        {"equipmentId": 1, "serialnumber": "11KH34567", "designation": "Toyota Hilux", "type": "Vehicule", "localization": "Bureau MCD", "status": "En service", "lastModified": "2020-03-12"},
        {"equipmentId": 2, "serialnumber": "XD1276578", "designation": "Toyota Hilux", "type": "Vehicule", "localization": "Bureau MCD", "status": "En service", "lastModified": "2020-03-12"},
        {"equipmentId": 3, "serialnumber": "567HJG878", "designation": "Toyota Hilux", "type": "Vehicule", "localization": "Bureau MCD", "status": "En service", "lastModified": "2020-03-12"},
        {"equipmentId": 4, "serialnumber": "YTU78645G", "designation": "Toyota Hilux", "type": "Vehicule", "localization": "Bureau MCD", "status": "En service", "lastModified": "2020-03-12"},
        {"equipmentId": 5, "serialnumber": "76GFH6VHB", "designation": "Toyota Hilux", "type": "Vehicule", "localization": "Bureau MCD", "status": "En service", "lastModified": "2020-03-12"}
    ];

    $scope.loadList = function(){
        openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
            $scope.equipments = response.results;
        });
    }

    $scope.upsert = function(){
        if ($scope.agent && $scope.agent.uuid) {    // edit
            console.log("Updating the equipment ", $scope.equipment.uuid)
            openmrsRest.update($scope.ressource + "equipment", $scope.equipment).then(function (response) {
                console.log(response);
            });
        } else {    // creation
            console.log("Creating new equipment ")
            openmrsRest.create($scope.ressource + "equipment", $scope.equipment).then(function (response) {
                console.log(response);
            });
        }
    }

    $scope.view = function(equipment){
        $scope.equipment = equipment;
    }
    
}]);