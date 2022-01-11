angular.module('MovementController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MovementController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Equipment movement");
    $scope.resource = "savicsgmao";
    $rootScope.links = { "gmao management module": "", "movement": "movements", "Edit": "movement" };
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Movement"] = "/movements";
    $scope.operation = {
        lines: []
    };


    function getAllEquipments() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/equipment").then(function (response) {
            $scope.loading = false;
            $scope.equipments = response.results;
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllEquipments()."), "error");
        });
    }

    getAllEquipments();

    $scope.selectedItemChange = function (item, index) {
        if (item) {
            $scope.operation.lines[index].name = item.name;
            $scope.operation.lines[index].id = item.id;
            $scope.operation.lines[index].serialNumber = item.serialNumber;
        }
    }

    $scope.save = function () {
        $scope.loading = true;
        var query = JSON.stringify($scope.operation);
        console.log(query);
        return;
        if ($scope.operation && $scope.equipment.serialNumber && $scope.equipment.serialNumber.length >= 3 && $scope.equipment.serialNumber.length <= 120 && $scope.equipment.designation && $scope.equipment.designation != "") {
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

    $scope.addSendingLine = function () {
        $scope.operation.lines.push({ name: "", id: "", serialNumber: "" });
    }

    $scope.deleteSendingDetail = function (sendingDetail, index) {
        var confirm = $mdDialog.confirm()
            .title('Confirmation')
            .textContent($translate.instant('Do you really want to delete this line ?'))
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $scope.operation.lines.splice(index, 1);
        }, function () {

        });
    }

    function showToast(msg, type) {
        $mdToast.show(
            $mdToast.simple()
                .content(msg)
                .theme(type + "-toast")
                .position('top right')
                .hideDelay(3000))
            .then(function () {
                $log.log($translate.instant('Toast dismissed.'));
            }).catch(function () {
                $log.log($translate.instant('Toast failed or was forced to close early by another toast.'));
            });
    }

}]);
