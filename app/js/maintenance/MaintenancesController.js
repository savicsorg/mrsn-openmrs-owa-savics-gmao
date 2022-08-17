angular.module('MaintenancesController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('MaintenancesController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$q', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $q, $translate) {
    $scope.rootScope = $rootScope;
    $scope.appTitle = $translate.instant("History of Maintenances");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    var originatorEv;
    var today = new Date();
    $scope.export_enddate = today;
    $scope.export_startdate = addDays(today, 90);
    //Breadcrumbs properties
    $rootScope.links = { "Module GMAO": "", "Maintenance Management": "History of Maintenances" };
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = { autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true };
    $scope.query = { limit: 50, page: 1, startIndex: 0, count: 0, order: '-id' };
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

    $scope.openMenu = function ($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };

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

    $scope.downloadByHigherFailure = function (startdate, enddate) {
        if (startdate == undefined || enddate == undefined) {
            toastr.error($translate.instant('Please select a range of exportation'), 'Error');
            return;
        }
        let link = window.location.protocol + "//" + window.location.host + "/openmrs/ws/rest/v1/savicsgmao/maintenances/withFailureRate?from=" + formatDate(startdate, 'YYYY-MM-DD') + "&to=" + formatDate(enddate, 'YYYY-MM-DD');
        localStorage.setItem("export_link_by_date", link);
        window.location = link;
    }

    function formatDate(date, format) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        let myformat = [year, month, day].join('-');
        if (format == "YYYY-MM-DD") {
            [year, month, day].join('-');
        } else {
            myformat = [day, month, year].join('/');

        }

        return myformat;
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }
}]);