angular.module('EquipmentController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('EquipmentController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
        $scope.rootscope = $rootScope;

        $scope.appTitle = $translate.instant("Equipment management");
        $scope.resource = "savicsgmao";
        $rootScope.links = {"Pharmacy management module": "", "Equipment": "equipments", "Edit": "equipment"};
        $scope.loading = false;
        $scope.equipment = {};

        //Breadcrumbs properties
        $rootScope.links = {};
        $rootScope.links["Home"] = "";
        $rootScope.links["Equipements"] = "/equipements";
        $scope.equipement = {};

        $scope.getEquipmentTypes = function () {
            return openmrsRest.getFull($scope.resource + "/equipmentType").then(function (response) {
                $scope.equipmentTypes = response.results;

            }, function (e) {
                $scope.equipmentTypes = [];
            });
        };
        $scope.getEquipmentTypes();

        $scope.getDepartments = function () {
            return openmrsRest.getFull($scope.resource + "/department").then(function (response) {
                $scope.departments = response.results;

            }, function (e) {
                $scope.departments = [];
            });
        };
        $scope.getDepartments();


        $scope.save = function () {
            $scope.loading = true;
            var query = JSON.parse(JSON.stringify($scope.equipment));
            query.status = !query.status ? 0: query.status ;
            
            if ($scope.equipment && $scope.equipment.serialNumber && $scope.equipment.serialNumber.length >= 3 && $scope.equipment.serialNumber.length <= 120 && $scope.equipment.designation && $scope.equipment.designation != "") {
                if ($scope.equipment.uuid) {    //Edit
                    openmrsRest.update($scope.resource + "/equipment", query).then(function (response) {
                        $scope.equipment = response;
                        //$scope.getData();
                        //$state.go('home.equipments', {});
                        toastr.success($translate.instant('Data saved successfully.'), 'Success');
                        $state.go('home.equipments');
                        $scope.loading = false;
                    }, function (e) {
                        $scope.loading = false;
                        toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                    });
                } else {    //Creation
                    openmrsRest.create($scope.resource + "/equipment", query).then(function (response) {
                        //$scope.equipment = response;
                        //$scope.getData();
                        toastr.success($translate.instant('Data saved successfully.'), 'Success');
                        $state.go('home.equipments');
                        $scope.loading = false;
                    }, function (e) {
                        $scope.loading = false;
                        console.log(e)
                        toastr.error($translate.instant('An unexpected error has occured.'), $translate.instant('Error'));
                    });
                }
            } else {
                $scope.loading = false;
                if (!$scope.equipment.serialNumber || !$scope.equipment.designation) {
                    toastr.error($translate.instant('You must fill in the required fields before you proceed.'), $translate.instant('Error'));
                }
                if ($scope.equipment.serialNumber && ($scope.equipment.serialNumber.length <= 3 || $scope.equipment.serialNumber.length > 120)) {
                    toastr.error($translate.instant('The equipment serialNumber must be between 3 and 120 characters max.'), $translate.instant('Error'));
                } else if ($scope.equipment.designation && $scope.equipment.designation == "") {
                    toastr.error($translate.instant('The equipment designation must not be empty.'), $translate.instant('Error'));
                }
            }

        }



    }]);
