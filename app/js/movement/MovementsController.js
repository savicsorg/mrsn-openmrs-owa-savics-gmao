angular.module('MovementsController', ['ngMaterial', 'md.data.table']).controller('MovementsController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$q', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $q, $translate) {
        $scope.rootscope = $rootScope;
        $scope.appTitle = $translate.instant("History of Movements");
        $scope.resource = "savicsgmao";
        $scope.loading = false;
        //Breadcrumbs properties
        $rootScope.links = {"Module GMAO": "", "History of Movements": "movements"};
        $scope.label = {
            page: $translate.instant("Page") + $translate.instant(":"),
            rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
            of: $translate.instant("of")
        }
        $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
        $scope.query = {limit: 50, page: 1, startIndex: 0, count: 0, order: '-id'};
        $scope.movements = [];
        $scope.movementValidated = false
        $scope.searchAll = "";
        $scope.canBeValidated = false;

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

        function deleteObject(movement) {
            $scope.loading = true;
            openmrsRest.remove($scope.resource + "/mouvement", movement, "Generic Reason").then(function (response) {
                getAllMovements();
                toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
            }, function (e) {
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }

        function getAllMovements() {
            $scope.loading = true;
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
            openmrsRest.getFull($scope.resource + "/mouvement?limit=" + $scope.query.limit + "&startIndex=" + $scope.query.startIndex).then(function (response) {
                $scope.loading = false;
                $scope.movements = response.results;
                openmrsRest.get($scope.resource + "/mouvement/count").then(function (response) {
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
                showToast($translate.instant("An unexpected error has occured with getAllMovements()."), "error");
            });
        }

        getAllMovements();

        $scope.search = function (item) {
            if ($scope.searchAll == "" || ($scope.searchAll.length > 0 && item.equipment.name.toLowerCase().indexOf($scope.searchAll.toLowerCase()) > -1)) {
                if ($scope.movementValidated === true) {
                    return item.status == "VALID";
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };

        $scope.edit = function (data, selectedItem, canValidate) {
            var canBeValidated = false;
            if (canValidate){
                canBeValidated = canValidate;
            }
            
            data.selectedItem = selectedItem;
            $state.go('home.movement', {
                operation_id: data.id,
                canBeValidated: canBeValidated,
                data: data,
            });
        };

        $scope.donwload = function () {
            let link = window.location.protocol + "//" + window.location.host + "/openmrs/ws/rest/v1/savicsgmao/mouvement/export?movementValidated=" + $scope.movementValidated;
            localStorage.setItem("export_link", link);
            window.location = link;
        }
    }]);