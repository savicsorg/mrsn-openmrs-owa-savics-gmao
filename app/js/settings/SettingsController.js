angular.module('SettingsController', ['ngMaterial', 'ngAnimate', 'toastr', 'md.data.table']).controller('SettingsController', ['$scope', '$rootScope', '$mdToast', '$state', '$stateParams', '$mdDialog', 'openmrsRest', 'toastr', '$translate', function ($scope, $rootScope, $mdToast, $state, $stateParams, $mdDialog, openmrsRest, toastr, $translate) {
    $scope.rootscope = $rootScope;
    $scope.appTitle = $translate.instant("Settings");
    $scope.resource = "savicsgmao";
    $scope.loading = false;
    //Breadcrumbs properties
    $rootScope.links = {"GMAO Module": "", "Settings": "settings"};
    $scope.label = {
        page: $translate.instant("Page") + $translate.instant(":"),
        rowsPerPage: $translate.instant("Rows per page") + $translate.instant(":"),
        of: $translate.instant("of")
    }
    $scope.options = {autoSelect: true, boundaryLinks: false, largeEditDialog: true, pageSelector: true, rowSelection: true};
    $scope.query = {limit: 5, page: 1};

    $scope.equipmentTypes = [];
    $scope.equipmentType = {};

    $scope.departments = [];
    $scope.department = {};

    $scope.regions = [];
    $scope.region = {};

    $scope.districts = [];
    $scope.district = {region:{}};

    $scope.siteLocations = [];
    $scope.siteLocation = {district:{}};

    $scope.siteTab = 1;

    //agents
    $scope.readAgent = function (agent) {
        $scope.agent = agent;
    }

    $scope.clearAgent = function () {
        $scope.agent = {};
    }

    //departments
    $scope.clearDepartment = function () {
        $scope.department = {};
    }

    $scope.saveDepartment = function () {
        $scope.loading = true;
        if ($scope.department && $scope.department.uuid) {//edit
            console.log($translate.instant("Updating the department "), $scope.department.uuid)
            openmrsRest.update($scope.resource + "/department", $scope.department).then(function (response) {
                console.log(response);
                loadDepartments();    
                toastr.success($translate.instant('Data removed successfully.'), 'Success');              
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {//Creation
            console.log($translate.instant("Creating new department "))
            openmrsRest.create($scope.resource + "/department", $scope.department).then(function (response) {
                console.log(response);
                loadDepartments();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }
    }

    $scope.deleteDepartment = function (department) {
        $scope.loading = true;
        console.log(department)
        openmrsRest.remove($scope.resource + "/department", department, "Generic Reason").then(function (response) {
            console.log(response);
            loadDepartments();
            toastr.success($translate.instant('Data removed successfully.'), 'Success');   
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadDepartments() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/department").then(function (response) {
            $scope.showLoading = false;
            $scope.departments = response.results;
            console.log($scope.departments);
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    $scope.readDepartment = function (department) {
        $scope.department = department;
    }

    //equipmentTypes
    $scope.clearEquipmentType = function () {
        $scope.equipmentType = {};
    }

    $scope.saveEquipmentType = function () {
        $scope.loading = true;
        if ($scope.equipmentType && $scope.equipmentType.uuid) {//edit
            console.log("Updating the equipmentType ", $scope.equipmentType.uuid)
            openmrsRest.update($scope.resource + "/equipmentType", $scope.equipmentType).then(function (response) {
                console.log(response);
                loadEquipmentTypes();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {//Creation
            console.log("Creating new equipmentType ")
            openmrsRest.create($scope.resource + "/equipmentType", $scope.equipmentType).then(function (response) {
                console.log(response);
                loadEquipmentTypes();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }
    }

    $scope.deleteEquipmentType = function (equipmentType) {
        $scope.loading = true;
        console.log(equipmentType)
        openmrsRest.remove($scope.resource + "/equipmentType", equipmentType, "Generic Reason").then(function (response) {
            console.log(response);
            loadEquipmentTypes();
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadEquipmentTypes() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/equipmentType").then(function (response) {
            $scope.showLoading = false;
            $scope.equipmentTypes = response.results;
            console.log($scope.equipmentTypes);
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    $scope.readEquipmentType = function (equipmentType) {
        $scope.equipmentType = equipmentType;
    }

    //region
    $scope.clearRegion = function () {
        $scope.region = {};
    }

    $scope.saveRegion = function () {
        $scope.loading = true;
        if ($scope.region && $scope.region.uuid) {//edit
            console.log("Updating the region ", $scope.region.uuid)
            openmrsRest.update($scope.resource + "/region", $scope.region).then(function (response) {
                console.log(response);
                loadRegions();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {//Creation
            console.log("Creating new region ")
            openmrsRest.create($scope.resource + "/region", $scope.region).then(function (response) {
                console.log(response);
                loadRegions();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }
    }

    $scope.deleteRegion = function (region) {
        $scope.loading = true;
        console.log(region)
        openmrsRest.remove($scope.resource + "/region", region, "Generic Reason").then(function (response) {
            console.log(response);
            loadRegions();
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadRegions() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/region").then(function (response) {
            $scope.showLoading = false;
            $scope.regions = response.results;
            console.log($scope.regions);
            loadDistricts();
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    $scope.readRegion = function (region) {
        $scope.region = region;
    }

    //district
    $scope.clearDistrict = function () {
        $scope.district = {region:{}};
    }

    $scope.saveDistrict = function () {
        $scope.loading = true;
        $scope.district.region = parseInt($scope.district.region.id);
        if ($scope.district && $scope.district.uuid) {//edit
            console.log("Updating the district ", $scope.district.uuid)
            openmrsRest.update($scope.resource + "/district", $scope.district).then(function (response) {
                console.log(response);
                $scope.district = response;
                loadDistricts();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {//Creation
            console.log("Creating new disctrict ")
            openmrsRest.create($scope.resource + "/district", $scope.district).then(function (response) {
                console.log(response);
                $scope.district = response;
                loadDistricts();
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }
    }

    $scope.deleteDistrict = function (disctrict) {
        $scope.loading = true;
        console.log(disctrict)
        openmrsRest.remove($scope.resource + "/district", disctrict, "Generic Reason").then(function (response) {
            console.log(response);
            loadDistricts();
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadDistricts() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/district").then(function (response) {
            $scope.showLoading = false;
            $scope.districts = response.results;
            console.log($scope.districts);
            loadSiteLocations();
            $scope.loading = false;               
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    $scope.readDistrict = function (district) {
        $scope.district = district;
    }

    //siteLocations
    $scope.clearSiteLocation = function () {
        $scope.siteLocation = {district:{}};
    }

    $scope.saveSiteLocation = function () {
        $scope.loading = true;
        $scope.siteLocation.district = parseInt($scope.siteLocation.district.id);
        if ($scope.siteLocation && $scope.siteLocation.uuid) {//edit
            console.log("Updating the SiteLocation ", $scope.siteLocation.uuid)
            openmrsRest.update($scope.resource + "/siteLocation", $scope.siteLocation).then(function (response) {
                console.log(response);
                $scope.siteLocation = response;
                loadSiteLocations() ;
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        } else {//Creation
            console.log("Creating new siteLocation ")
            openmrsRest.create($scope.resource + "/siteLocation", $scope.siteLocation).then(function (response) {
                console.log(response);
                $scope.siteLocation = response;
                loadSiteLocations() ;
                toastr.success($translate.instant('Data removed successfully.'), 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
            });
        }
    }

    $scope.deleteSiteLocation = function (siteLocation) {
        $scope.loading = true;
        console.log(siteLocation)
        openmrsRest.remove($scope.resource + "/siteLocation", siteLocation, "Generic Reason").then(function (response) {
            console.log(response);
            loadSiteLocations() ;
            toastr.success($translate.instant('An unexpected error has occured.'), 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    function loadSiteLocations() {
        $scope.loading = true;
        openmrsRest.getFull($scope.resource + "/siteLocation").then(function (response) {
            $scope.showLoading = false;
            $scope.siteLocations = response.results;
            console.log($scope.siteLocations)
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error($translate.instant('An unexpected error has occured.'), 'Error');
        });
    }

    $scope.readSiteLocation = function (siteLocation) {
        $scope.siteLocation = siteLocation;
    }

    var loadData = function(){
        loadDepartments();
        loadEquipmentTypes();
        loadRegions();
        loadDistricts();
        loadSiteLocations();
    }
    loadData();
}]);