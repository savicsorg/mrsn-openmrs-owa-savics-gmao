angular.module('MovementController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MovementController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.lines = [];


    $scope.addSendingLine = function () {
        $scope.lines.push({
            operation: { equipment_serial_number: "", equipment_id_number: "" }
        });
    }

    $scope.deleteSendingDetail = function (sendingDetail, index) {
        var confirm = $mdDialog.confirm()
            .title('Confirmation')
            .textContent($translate.instant('Do you really want to delete this line ?'))
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $scope.lines.splice(index, 1);
        }, function () {

        });
    }

}]);
