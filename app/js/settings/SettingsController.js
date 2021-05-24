angular.module('SettingsController', ['ngMaterial','ngAnimate', 'toastr']).controller('SettingsController', ['$scope', '$rootScope', 'openmrsRest', 'toastr', function ($scope, $rootScope, openmrsRest, toastr) {
    $scope.rootscope = $rootScope;

    console.log("SettingsController new form ---")
    $scope.mySettings = [{}];
    $scope.appTitle = "Gestion des equipements";
    $scope.resource = "savicsgmao";
    //Breadcrumbs properties
    $rootScope.links = {};
    $rootScope.links["Home"] = "";
    $rootScope.links["Settings"] = "settings";

    $scope.ressource = "savicsgmao/";

    $scope.query = {
        order: '',
        page: 0,
        limit: 10
    }

    $scope.loading = false;

    $scope.options = {
        //autoSelect: true,
        boundaryLinks: false,
        //largeEditDialog: true,
        //pageSelector: true,
        rowSelection: true
    };

    $scope.maintenanceReasons = [];
    $scope.maintenanceReason = {};

    $scope.equipmentTypes = [];
    $scope.equipmentType = {};

    $scope.departments = [];
    $scope.department = {};

    $scope.agents = [];
    $scope.agent = {};

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

    $scope.saveAgent = function () {
        $scope.loading = true;
        if ($scope.agent && $scope.agent.uuid) {//edit
            console.log("Updating the agent ", $scope.agent.uuid)
            openmrsRest.update($scope.ressource + "agent", $scope.agent).then(function (response) {
                console.log(response);
                loadAgents();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new agent ")
            openmrsRest.create($scope.ressource + "agent", $scope.agent).then(function (response) {
                console.log(response);
                loadAgents();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    function loadAgents() {
        $scope.loading = true;
        openmrsRest.getFull($scope.ressource + "agent").then(function (response) {
            $scope.showLoading = false;
            $scope.agents = response.results;
            console.log($scope.agents);
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    $scope.deleteAgent = function (agent) {
        $scope.loading = true;
        console.log(agent)
        openmrsRest.remove($scope.ressource + "agent", agent, "Generic Reason").then(function (response) {
            console.log(response);
            $scope.loading = false;
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    //departments
    $scope.clearDepartment = function () {
        $scope.department = {};
    }

    $scope.saveDepartment = function () {
        $scope.loading = true;
        if ($scope.department && $scope.department.uuid) {//edit
            console.log("Updating the department ", $scope.department.uuid)
            openmrsRest.update($scope.ressource + "department", $scope.department).then(function (response) {
                console.log(response);
                loadDepartments();    
                toastr.success('Data saved successfully.', 'Success');              
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new department ")
            openmrsRest.create($scope.ressource + "department", $scope.department).then(function (response) {
                console.log(response);
                loadDepartments();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    $scope.deleteDepartment = function (department) {
        $scope.loading = true;
        console.log(department)
        openmrsRest.remove($scope.ressource + "department", department, "Generic Reason").then(function (response) {
            console.log(response);
            loadDepartments();
            toastr.success('Data removed successfully.', 'Success');   
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    function loadDepartments() {
        $scope.loading = true;
        openmrsRest.getFull($scope.ressource + "department").then(function (response) {
            $scope.showLoading = false;
            $scope.departments = response.results;
            console.log($scope.departments);
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
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
            openmrsRest.update($scope.ressource + "equipmentType", $scope.equipmentType).then(function (response) {
                console.log(response);
                loadEquipmentTypes();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new equipmentType ")
            openmrsRest.create($scope.ressource + "equipmentType", $scope.equipmentType).then(function (response) {
                console.log(response);
                loadEquipmentTypes();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    $scope.deleteEquipmentType = function (equipmentType) {
        $scope.loading = true;
        console.log(equipmentType)
        openmrsRest.remove($scope.ressource + "equipmentType", equipmentType, "Generic Reason").then(function (response) {
            console.log(response);
            loadEquipmentTypes();
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    function loadEquipmentTypes() {
        $scope.loading = true;
        openmrsRest.getFull($scope.ressource + "equipmentType").then(function (response) {
            $scope.showLoading = false;
            $scope.equipmentTypes = response.results;
            console.log($scope.equipmentTypes);
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
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
            openmrsRest.update($scope.ressource + "region", $scope.region).then(function (response) {
                console.log(response);
                loadRegions();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new region ")
            openmrsRest.create($scope.ressource + "region", $scope.region).then(function (response) {
                console.log(response);
                loadRegions();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    $scope.deleteRegion = function (region) {
        $scope.loading = true;
        console.log(region)
        openmrsRest.remove($scope.ressource + "region", region, "Generic Reason").then(function (response) {
            console.log(response);
            loadRegions();
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    function loadRegions() {
        $scope.loading = true;
        openmrsRest.getFull($scope.ressource + "region").then(function (response) {
            $scope.showLoading = false;
            $scope.regions = response.results;
            console.log($scope.regions);
            loadDistricts();
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
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
            openmrsRest.update($scope.ressource + "district", $scope.district).then(function (response) {
                console.log(response);
                $scope.region = response;
                loadDistricts();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new disctrict ")
            openmrsRest.create($scope.ressource + "district", $scope.district).then(function (response) {
                console.log(response);
                $scope.region = response;
                loadDistricts();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    $scope.deleteDistrict = function (disctrict) {
        $scope.loading = true;
        console.log(disctrict)
        openmrsRest.remove($scope.ressource + "district", disctrict, "Generic Reason").then(function (response) {
            console.log(response);
            loadDistricts();
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    function loadDistricts() {
        $scope.loading = true;
        openmrsRest.getFull($scope.ressource + "district").then(function (response) {
            $scope.showLoading = false;
            $scope.districts = response.results;
            console.log($scope.districts);
            loadSiteLocations();
            $scope.loading = false;               
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
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
            openmrsRest.update($scope.ressource + "siteLocation", $scope.siteLocation).then(function (response) {
                console.log(response);
                $scope.region = response;
                loadSiteLocations() ;
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new siteLocation ")
            openmrsRest.create($scope.ressource + "siteLocation", $scope.siteLocation).then(function (response) {
                console.log(response);
                $scope.region = response;
                loadSiteLocations() ;
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    $scope.deleteSiteLocation = function (siteLocation) {
        $scope.loading = true;
        console.log(siteLocation)
        openmrsRest.remove($scope.ressource + "siteLocation", siteLocation, "Generic Reason").then(function (response) {
            console.log(response);
            loadSiteLocations() ;
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    function loadSiteLocations() {
        $scope.loading = true;
        openmrsRest.getFull($scope.ressource + "siteLocation").then(function (response) {
            $scope.showLoading = false;
            $scope.siteLocations = response.results;
            console.log($scope.siteLocations)
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    $scope.readSiteLocation = function (siteLocation) {
        $scope.siteLocation = siteLocation;
    }

    //maintenanceReasons
    $scope.clearMaintenanceReason = function () {
        $scope.maintenanceReason = {};
    }

    $scope.saveMaintenanceReason = function () {
        $scope.loading = true;
        if ($scope.maintenanceReason && $scope.maintenanceReason.uuid) {//edit
            console.log("Updating the maintenanceReason ", $scope.maintenanceReason.uuid)
            openmrsRest.update($scope.ressource + "maintenanceReason", $scope.maintenanceReason).then(function (response) {
                console.log(response);
                loadMaintenanceReasons();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        } else {//Creation
            console.log("Creating new maintenanceReason ")
            openmrsRest.create($scope.ressource + "maintenanceReason", $scope.maintenanceReason).then(function (response) {
                console.log(response);
                loadMaintenanceReasons();
                toastr.success('Data saved successfully.', 'Success');   
            },function(e){
                console.error(e);
                $scope.loading = false;
                toastr.error('An unexpected error has occured.', 'Error');
            });
        }
    }

    $scope.deleteMaintenanceReason = function (maintenanceReason) {
        $scope.loading = true;
        console.log(maintenanceReason)
        openmrsRest.remove($scope.ressource + "maintenanceReason", maintenanceReason, "Generic Reason").then(function (response) {
            console.log(response);
            loadMaintenanceReasons();
            toastr.success('Data removed successfully.', 'Success');
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    function loadMaintenanceReasons() {
        $scope.loading = true;
        openmrsRest.getFull($scope.ressource + "maintenanceReason").then(function (response) {
            $scope.showLoading = false;
            $scope.maintenanceReasons = response.results;
            console.log($scope.maintenanceReasons);
            $scope.loading = false;
        },function(e){
            console.error(e);
            $scope.loading = false;
            toastr.error('An unexpected error has occured.', 'Error');
        });
    }

    $scope.readMaintenanceReason = function (maintenanceReason) {
        $scope.maintenanceReason = maintenanceReason;
    }

    var loadData = function(){
        loadAgents();
        loadDepartments();
        loadEquipmentTypes();
        loadRegions();
        loadDistricts();
        loadSiteLocations();
        loadMaintenanceReasons();
    }

    loadData();

}]);