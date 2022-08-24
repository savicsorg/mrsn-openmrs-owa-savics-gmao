angular.module('MaintenanceScheduleController', ['ngMaterial', 'md.data.table']).controller('MaintenanceScheduleController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$q', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $q, $translate) {
    $scope.rootScope = $rootScope;
    $scope.appTitle = $translate.instant("Management of Equipements");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = { "Module GMAO": "", "maintenanceSchedule": "maintenanceSchedule" };
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }

    $scope.options = { autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true };
    $scope.query = { limit: 50, page: 1, startIndex: 0, count: 0, order: '-id' };

    var dictionary = require("../utils/dictionary");

    $scope.schedules = [];

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

    function deleteObject(schedule) {
        $scope.loading = true;
        openmrsRest.remove($scope.resource + "/schedule", schedule, "Generic Reason").then(function (response) {
            $scope.loading = false;
            getAllSchedules();
            toastr.success($translate.instant('The item has been successfully deleted.'), 'Success');
        }, function (e) {
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    $scope.openEdit = function (data) {
        $state.go('home.schedule', {
            schedule_id: data.id,
            data: data,
        });
    }

    function getAllSchedules() {
        $scope.loading = true;
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
        $scope.schedules = [
            { equipement: "GenExpert", periodical_type: "Quarterly", start_date: "21-02-2021", next_date: "19-08-2022", alert: true },
            { equipement: "Vehicle Hiace", periodical_type: "Quarterly", start_date: "21-02-2021", next_date: "19-08-2022", alert: true },
            { equipement: "Photocopieuse", periodical_type: "Annually", start_date: "21-02-2021", next_date: "21-02-2022", alert: false },
            { equipement: "Bed", periodical_type: "Quarterly", start_date: "21-02-2021", next_date: "19-08-2022", alert: true },
            { equipement: "Office chair", periodical_type: "Quarterly", start_date: "21-02-2021", next_date: "19-08-2022", alert: true },
        ]

        // openmrsRest.getFull($scope.resource + "/schedule?limit=" + $scope.query.limit + "&startIndex=" + $scope.query.startIndex).then(function (response) {
        //     $scope.loading = false;
        //     $scope.schedules = response.results;
        //     openmrsRest.get($scope.resource + "/schedule/count").then(function (response) {
        //         if (response.count) {
        //             $scope.query.count = response.count;
        //         }
        //         $rootScope.kernel.loading = 100;
        //         deferred.resolve(response.results);
        //     }, function (e) {
        //         $scope.loading = false;
        //         showToast($translate.instant("An unexpected error has occured."), "error");
        //     });
        // }, function (e) {
        //     $scope.loading = false;
        //     showToast($translate.instant("An unexpected error has occured with getAllSchedules()."), "error");
        // });
    }

    getAllSchedules();


    $scope.donwload = function () {
        let link = window.location.protocol + "//" + window.location.host + "/openmrs/ws/rest/v1/savicsgmao/schedule/export";
        localStorage.setItem("export_link", link);
        window.location = link;
    }

}]);