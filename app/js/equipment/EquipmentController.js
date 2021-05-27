angular.module('EquipementController', []).controller('EquipementController', ['$scope', '$rootScope', '$state', '$stateParams', 'openmrsRest', function ($scope, $rootScope, $state, $stateParams, openmrsRest) {
        $scope.rootscope = $rootScope;

        console.log("EquipementController new form ---")
        $scope.appTitle = "Gestion des equipements";
        $scope.resource = "savicsgmao/agent";
        //Breadcrumbs properties
        $rootScope.links = {};
        $rootScope.links["Home"] = "";
        $rootScope.links["Equipements"] = "/equipements";
        $scope.equipement = {};

        $scope.appTitle = "Gestion des equipements";
        $scope.resource = "savicsgmao/agent";
        $scope.departments = [
            {department_id: 1, name: 'Department 1'},
            {department_id: 2, name: 'Department 2'}
        ];
        $scope.equipmentTypes = [
            {equipment_type_id: 1, name: 'Type 1'},
            {equipment_type_id: 2, name: 'Type 2'}
        ];


        //loadSettingss();

        function loadEquipmnts() {
            openmrsRest.getFull("savicsgmao/equipment").then(function (response) {
                $scope.showLoading = false;
                $scope.equipments = response.results;
            });
        }

        loadEquipmnts();

        $scope.view = function (id) {

        }

    }]);
