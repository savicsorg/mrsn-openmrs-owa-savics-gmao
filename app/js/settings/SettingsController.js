angular.module('SettingsController', ['ngMaterial']).controller('SettingsController', ['$scope', '$rootScope', 'openmrsRest', function ($scope, $rootScope, openmrsRest) {
        $scope.rootscope = $rootScope;

        console.log("SettingsController new form ---")
        $scope.mySettingss = [{}];
        $scope.appTitle = "Gestion des equipements";
        $scope.resource = "savicsgmao/Settings";
        //Breadcrumbs properties
        $rootScope.links = {};
        $rootScope.links["Home"] = "";
        $rootScope.links["Settings"] = "/settings";

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
        $scope.district = {};

        $scope.siteLocations = [];
        $scope.siteLocation = {};

        $scope.siteTab = 1;

        //agents
        $scope.readAgent = function (agent) {
            $scope.agent = agent;
        }

        $scope.clearAgent = function () {
            $scope.agent = {};
        }

        $scope.saveAgent = function () {
            if ($scope.agent && $scope.agent.uuid) {//edit
                console.log("Updating the agent ", $scope.agent.uuid)
                openmrsRest.update("savicsgmao/agent", $scope.agent).then(function (response) {
                    console.log(response);
                    loadAgents();
                });
            } else {//Creation
                console.log("Creating new agent ")
                openmrsRest.create("savicsgmao/agent", $scope.agent).then(function (response) {
                    console.log(response);
                    loadAgents();
                });
            }
        }

        function loadAgents() {
            openmrsRest.getFull("savicsgmao/agent").then(function (response) {
                $scope.showLoading = false;
                $scope.agents = response.results;
                console.log($scope.agents)
            });
        }

        $scope.deleteAgent = function (agent) {
            console.log(agent)
            openmrsRest.remove("savicsgmao/agent", agent, "Reason XXX").then(function (response) {
                console.log(response);
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
                openmrsRest.update("savicsgmao/department", $scope.department).then(function (response) {
                    console.log(response);
                    loadDepartments();                  
                });
            } else {//Creation
                console.log("Creating new department ")
                openmrsRest.create("savicsgmao/department", $scope.department).then(function (response) {
                    console.log(response);
                    loadDepartments();
                });
            }
        }

        $scope.deleteDepartment = function (department) {
            $scope.loading = true;
            console.log(department)
            openmrsRest.remove("savicsgmao/department", department, "Generic Reason").then(function (response) {
                console.log(response);
                loadDepartments();
            });
        }

        function loadDepartments() {
            $scope.loading = true;
            openmrsRest.getFull("savicsgmao/department").then(function (response) {
                $scope.showLoading = false;
                $scope.departments = response.results;
                console.log($scope.departments);
                $scope.loading = false;
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
            if ($scope.equipmentType && $scope.equipmentType.uuid) {//edit
                console.log("Updating the equipmentType ", $scope.equipmentType.uuid)
                openmrsRest.update("savicsgmao/equipmentType", $scope.equipmentType).then(function (response) {
                    console.log(response);
                    loadEquipmentTypes();
                });
            } else {//Creation
                console.log("Creating new equipmentType ")
                openmrsRest.create("savicsgmao/equipmentType", $scope.equipmentType).then(function (response) {
                    console.log(response);
                    loadEquipmentTypes();
                });
            }
        }

        $scope.deleteEquipmentType = function (equipmentType) {
            console.log(equipmentType)
            openmrsRest.remove("savicsgmao/equipmentType", agent, "Generic Reason").then(function (response) {
                console.log(response);
                loadEquipmentTypes();
            });
        }

        function loadEquipmentTypes() {
            openmrsRest.getFull("savicsgmao/equipmentType").then(function (response) {
                $scope.showLoading = false;
                $scope.equipmentTypes = response.results;
                console.log($scope.equipmentTypes)
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
            if ($scope.region && $scope.region.uuid) {//edit
                console.log("Updating the region ", $scope.region.uuid)
                openmrsRest.update("savicsgmao/region", $scope.region).then(function (response) {
                    console.log(response);
                    loadRegions();
                });
            } else {//Creation
                console.log("Creating new region ")
                openmrsRest.create("savicsgmao/region", $scope.region).then(function (response) {
                    console.log(response);
                    loadRegions();
                });
            }
        }

        $scope.deleteRegion = function (region) {
            console.log(region)
            openmrsRest.remove("savicsgmao/region", agent, "Generic Reason").then(function (response) {
                console.log(response);
                loadRegions();
            });
        }

        function loadRegions() {
            openmrsRest.getFull("savicsgmao/region").then(function (response) {
                $scope.showLoading = false;
                $scope.equipmentTypes = response.results;
                console.log($scope.equipmentTypes)
            });
        }

        $scope.readRegion = function (region) {
            $scope.region = region;
        }

        //district
        $scope.clearDistrict = function () {
            $scope.district = {};
        }

        $scope.saveDistrict = function () {
            if ($scope.district && $scope.district.uuid) {//edit
                console.log("Updating the district ", $scope.district.uuid)
                openmrsRest.update("savicsgmao/district", $scope.district).then(function (response) {
                    console.log(response);
                    loadDistricts();
                });
            } else {//Creation
                console.log("Creating new disctrict ")
                openmrsRest.create("savicsgmao/district", $scope.district).then(function (response) {
                    console.log(response);
                    loadDistricts();
                });
            }
        }

        $scope.deleteDistrict = function (disctrict) {
            console.log(disctrict)
            openmrsRest.remove("savicsgmao/district", agent, "Generic Reason").then(function (response) {
                console.log(response);
                loadDistricts();
            });
        }

        function loadDistricts() {
            openmrsRest.getFull("savicsgmao/district").then(function (response) {
                $scope.showLoading = false;
                $scope.disctricts = response.results;
                console.log($scope.disctricts)
            });
        }

        $scope.readDistrict = function (district) {
            $scope.district = district;
        }

        //siteLocations
        $scope.clearSiteLocation = function () {
            $scope.siteLocation = {};
        }

        $scope.saveSiteLocation = function () {
            if ($scope.siteLocation && $scope.siteLocation.uuid) {//edit
                console.log("Updating the SiteLocation ", $scope.siteLocation.uuid)
                openmrsRest.update("savicsgmao/siteLocation", $scope.siteLocation).then(function (response) {
                    console.log(response);
                    loadSiteLocations() ;
                });
            } else {//Creation
                console.log("Creating new siteLocation ")
                openmrsRest.create("savicsgmao/siteLocation", $scope.siteLocation).then(function (response) {
                    console.log(response);
                    loadSiteLocations() ;
                });
            }
        }

        $scope.deleteSiteLocation = function (siteLocation) {
            console.log(siteLocation)
            openmrsRest.remove("savicsgmao/siteLocation", agent, "Generic Reason").then(function (response) {
                console.log(response);
                loadSiteLocations() ;
            });
        }

        function loadSiteLocations() {
            openmrsRest.getFull("savicsgmao/siteLocation").then(function (response) {
                $scope.showLoading = false;
                $scope.siteLocations = response.results;
                console.log($scope.siteLocations)
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
            if ($scope.maintenanceReason && $scope.maintenanceReason.uuid) {//edit
                console.log("Updating the maintenanceReason ", $scope.maintenanceReason.uuid)
                openmrsRest.update("savicsgmao/maintenanceReason", $scope.maintenanceReason).then(function (response) {
                    console.log(response);
                    loadMaintenanceReasons();
                });
            } else {//Creation
                console.log("Creating new maintenanceReason ")
                openmrsRest.create("savicsgmao/maintenanceReason", $scope.maintenanceReason).then(function (response) {
                    console.log(response);
                    loadMaintenanceReasons();
                });
            }
        }

        $scope.deleteMaintenanceReason = function (maintenanceReason) {
            console.log(maintenanceReason)
            openmrsRest.remove("savicsgmao/maintenanceReason", agent, "Generic Reason").then(function (response) {
                console.log(response);
                loadMaintenanceReasons();
            });
        }

        function loadMaintenanceReasons() {
            openmrsRest.getFull("savicsgmao/maintenanceReason").then(function (response) {
                $scope.showLoading = false;
                $scope.maintenanceReasons = response.results;
                console.log($scope.maintenanceReasons)
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