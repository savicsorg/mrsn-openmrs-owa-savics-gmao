angular.module('SettingsController', []).controller('SettingsController', ['$scope', '$rootScope', 'openmrsRest', function ($scope, $rootScope, openmrsRest) {
    $scope.rootscope = $rootScope;
    
    console.log("SettingsController new form ---")
    $scope.mySettingss = [{}];
    $scope.appTitle = "Gestion des equipements";
    $scope.resource = "savicsgmao/Settings";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Settings"] = "/Settingss";
    
    $scope.maintenanceReasons = [];
    $scope.maintenanceReason = {};

    $scope.equipmentTypes = [];
    $scope.equipmentType = {};

    $scope.departments = [];
    $scope.department = {};

    $scope.agents = [];
    $scope.agent = {};

    //loadSettingss();

    function loadSettingss() {
        openmrsRest.getFull("savicsgmao/Settings").then(function (response) {
            $scope.showLoading = false;
            $scope.Settingss = response.results;
        })
    }
}]);