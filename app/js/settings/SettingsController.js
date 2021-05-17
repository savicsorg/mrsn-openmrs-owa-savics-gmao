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

        $scope.regions = [];
        $scope.region = {};

        $scope.districts = [];
        $scope.district = {};

        $scope.sites = [];
        $scope.site = {};

        $scope.siteTab = 1;


        //loadSettingss();

        function loadAgents() {
            openmrsRest.getFull("savicsgmao/agent").then(function (response) {
                $scope.showLoading = false;
                $scope.agents = response.results;
                console.log($scope.agents)
            });
        }

        loadAgents();

        $scope.readAgent = function (agent) {
            $scope.agent = agent;
        }

        $scope.clear = function () {
            $scope.agent = {};
        }

        $scope.saveAgent = function () {
            if ($scope.agent && $scope.agent.uuid) {//edit
                console.log("Updating the agent ", $scope.agent.uuid)
                openmrsRest.update("savicsgmao/agent", $scope.agent).then(function (response) {
                    console.log(response);
                });
            } else {//Creation
                console.log("Creating new agent ")
                openmrsRest.create("savicsgmao/agent", $scope.agent).then(function (response) {
                    console.log(response);
                });
            }
        }

        $scope.deleteAgent = function (agent) {
            console.log(agent)
            openmrsRest.remove("savicsgmao/agent", agent, "Reason XXX").then(function (response) {
                console.log(response);
            });
        }

        $scope.createRegion = function () {
            var r = Math.floor(Math.random() * 26000) + 1;
            var region2 = {
                "fullName": "Agent Random " + r,
                "phoneNumber": "98762 087 86 " + r,
                "agentAddress": "Add " + r,
                "rollNumber": "0",
                "isExternal": 0,
                "department": 1,
                "siteLocation": 1
            }

            openmrsRest.create("savicsgmao/agent", region2).then(function (response) {
                console.log(response)
            })
        }

        function loadSettingss() {
            openmrsRest.getFull("savicsgmao/Settings").then(function (response) {
                $scope.showLoading = false;
                $scope.Settingss = response.results;
            })
        }
    }]);