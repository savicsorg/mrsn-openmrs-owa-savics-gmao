angular.module('MaintenanceScheduleController', ['ngMaterial', 'md.data.table']).controller('MaintenanceScheduleController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdToast', 'openmrsRest', '$mdDialog', '$q', '$translate', function ($scope, $state, $stateParams, $rootScope, $mdToast, openmrsRest, $mdDialog, $q, $translate) {
    var _ = require("underscore");
    $scope.rootScope = $rootScope;
    $scope.appTitle = $translate.instant("Management of Equipements");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    var today = new Date();
    $scope.export_enddate = today;
    $scope.export_startdate = addDays(today, 90);
    //Breadcrumbs properties
    $rootScope.links = { "Module GMAO": "", "maintenanceSchedule": "maintenanceSchedule" };
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    var dictionary = require("../utils/dictionary");
    var schedule_typesjson = require('../../json/maintenance/scheduletype.json');
    $scope.schedule_types = dictionary.getJsonList(schedule_typesjson, $rootScope.selectedLanguage);

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
        openmrsRest.remove($scope.resource + "/maintenanceEvent", schedule, "Generic Reason").then(function (response) {
            $scope.loading = false;
            getAllSchedules(null, null);
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

    $scope.getFrequancy = function (id) {
        var frequency = _.find($scope.schedule_types, function (p) { return p.id === id; });
        return frequency.value;
    }

    function getAllSchedules(startdate, enddate) {
        $scope.loading = true;
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        $scope.query.startIndex = $scope.query.limit * ($scope.query.page - 1);
        let url_custom = null;
        if (startdate != null && enddate != null) {
            url_custom = $scope.resource + "/maintenanceEvent?limit=" + $scope.query.limit + "&startIndex=" + $scope.query.startIndex + "&startdate=" + formatDate(startdate, 'YYYY-MM-DD') + "&enddate=" + formatDate(enddate, 'YYYY-MM-DD');
        } else {
            url_custom = $scope.resource + "/maintenanceEvent?limit=" + $scope.query.limit + "&startIndex=" + $scope.query.startIndex;
        }
        openmrsRest.getFull(url_custom).then(function (response) {
            $scope.loading = false;
            $scope.schedules = _.map(response.results, (d) => {
                if (d.status == 0) {
                    d.status_color = "orange";
                    d.status_label = $translate.instant("Canceled");
                }
                if (d.status == 1) {
                    d.status_color = "green";
                    d.status_label = $translate.instant("Active");
                }
                if (new Date() > new Date(d.enddate)) {
                    d.status = 2;
                    d.status_color = "gray";
                    d.status_label = $translate.instant("Exceeded");
                }
                return d;
            });
            $rootScope.kernel.loading = 100;
            deferred.resolve(response.results);
            // openmrsRest.get($scope.resource + "/maintenanceEvent/count").then(function (response) {
            //     if (response.count) {
            //         $scope.query.count = response.count;
            //     }
            //     $rootScope.kernel.loading = 100;
            //     deferred.resolve(response.results);
            // }, function (e) {
            //     $scope.loading = false;
            //     showToast($translate.instant("An unexpected error has occured."), "error");
            // });
        }, function (e) {
            $scope.loading = false;
            showToast($translate.instant("An unexpected error has occured with getAllSchedules()."), "error");
        });
    }

    getAllSchedules(null, null);


    $scope.donwload = function (startdate, enddate) {
        if (startdate == undefined || enddate == undefined) {
            toastr.error($translate.instant('Please select a range of exportation'), 'Error');
            return;
        }
        let link = window.location.protocol + "//" + window.location.host + "/openmrs/ws/rest/v1/savicsgmao/maintenances/planning?startdate=" + formatDate(startdate, 'YYYY-MM-DD') + "&enddate=" + formatDate(enddate, 'YYYY-MM-DD');
        localStorage.setItem("export_link", link);
        window.location = link;
    }

    $scope.filterByDate = function (export_startdate, export_enddat) {
        getAllSchedules(export_startdate, export_enddat);
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