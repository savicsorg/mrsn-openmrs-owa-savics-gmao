angular.module('SettingsController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('SettingsController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootScope = $rootScope;
    $scope.appTitle = $translate.instant("Settings");
    console.log("ctrl rootScope.account=");
    console.log($rootScope.account);
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"Module GMAO": "", "Settings": "settings"};

}]);