angular.module('RequestsController', ['ngMaterial', 'md.data.table']).controller('RequestsController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$q', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $q, $translate) {
    $scope.rootScope = $rootScope;
    $scope.appTitle = $translate.instant("History of Maintenance Requests");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = { "Module GMAO": "", "Maintenance Management": "History of Maintenance Requests" };
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = { autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true };
    $scope.query = { limit: 50, page: 1, startIndex: 0, count: 0, order: '-id' };
    $scope.requests = [];

    var dictionary = require("../utils/dictionary");
    var natureofworkjson = require('../../json/maintenance/natureofwork.json');
    $scope.natureofworks = dictionary.getJsonList(natureofworkjson, $rootScope.selectedLanguage);
    $scope.getElementById = function (id) {
        return dictionary.getElementById($scope.natureofworks, id, $rootScope.selectedLanguage);
    };

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

    function deleteObject(request) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/maintenanceRequest", request, "Generic Reason").then(function (response) {
            getAllRequests();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
        }, function (e) {
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    $scope.openEdit = function (data) {
        $state.go('home.request', {
            request_id: data.id,
            data: data,
        });
    }
    function getAllRequests() {
        $scope.loading = true;
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
        openmrsRest.getFull($scope.resource + "/maintenanceRequest?limit=" + $scope.query.limit + "&startIndex=" + $scope.query.startIndex).then(function (response) {
            $scope.loading = false;
            $scope.requests = response.results;
            openmrsRest.get($scope.resource + "/maintenanceRequest/count").then(function (response) {
                if (response.count) {
                    $scope.query.count = response.count;
                }
                $rootScope.kernel.loading = 100;
                deferred.resolve(response.results);
            }, function (e) {
                $scope.loading = false;
                showToast($translate.instant("An unexpected error has occured."), "error");
            });
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllRequests()."), "error");
        });
    }


    getAllRequests();

    $scope.donwload = function () {
        let link = window.location.protocol + "//" + window.location.host + "/openmrs/ws/rest/v1/savicsgmao/maintenancerequests/export";
        localStorage.setItem("export_link", link);
        window.location = link;
    }
}]);