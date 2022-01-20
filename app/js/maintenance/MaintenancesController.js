angular.module('MaintenancesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenancesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$q', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $q, $translate) {
        $scope.rootscope = $rootScope;
        $scope.appTitle = $translate.instant("History of Maintenances");
        $scope.resource = "savicsgmao";
        $scope.loading = false;
        //Breadcrumbs properties
        $rootScope.links = {"GMAO Module": "", "Maintenance Management": "History of Maintenances"};
        $scope.label = {
            page: $translate.instant("Page") + $translate.instant(":"),
            rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
            of: $translate.instant("of")
        }
        $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
        $scope.query = {limit: 50, page: 1, startIndex: 0, count: 0, order: '-id'};
        $scope.maintenances = [];

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

        function deleteObject(maintenance) {
            $scope.loading = true;
            openmrsRest.remove($scope.resource + "/maintenance", maintenance, "Generic Reason").then(function (response) {
                $scope.loading = false;
                getAllMaintenances();
                toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
            }, function (e) {
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }

        $scope.openEdit = function (data) {
            $state.go('home.maintenance', {
                maintenance_id: data.id,
                data: data,
            });
        }

        function getAllMaintenances() {
            $scope.loading = true;
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
            openmrsRest.getFull($scope.resource + "/maintenance?limit=" + $scope.query.limit + "&startIndex=" + $scope.query.startIndex).then(function (response) {
                $scope.loading = false;
                $scope.maintenances = response.results;
                openmrsRest.get($scope.resource + "/maintenances/count").then(function (response) {
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
                showToast($translate.instant("An unexpected error has occured with getAllMaintenances()."), "error");
            });
        }

        getAllMaintenances();



        $scope.donwload = function () {
            let link = window.location.protocol + "//" + window.location.host + "/openmrs/ws/rest/v1/savicsgmao/maintenances/export";
            localStorage.setItem("export_link", link);
            window.location = link;
        }
    }]);