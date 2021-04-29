angular.module('AgentsController', []).controller('AgentsController', ['$scope', '$rootScope', 'openmrsRest', function ($scope, $rootScope, openmrsRest) {
        $scope.rootscope = $rootScope;

        console.log("AgentsController new form ---")
        $scope.myAgents = [{}];
        $scope.appTitle = "Gestion des equipements";
        $scope.resource = "savicsgmao/agent";
        //Breadcrumbs properties
        $rootScope.links = {};
        $rootScope.links["Home"] = "";
        $rootScope.links["Agents"] = "/agents";

        loadAgents();

        function loadAgents() {
            openmrsRest.getFull("savicsgmao/agent").then(function (response) {
                $scope.showLoading = false;
                $scope.agents = response.results;
            })

            var region1 = {
                "regionName": "Ma region 1",
                "regionCode": "MR1"
            }
            var region2 = {
                "regionName": "Ma region 2",
                "regionCode": "MR2"
            }
        }

        $scope.createRegion = function () {
            var r = Math.floor(Math.random() * 26000) + 1;
            var region2 = {
                "fullName": "Agent Random "+r,
                "phoneNumber": "98762 087 86 "+r,
                "agentAddress": "Add "+r,
                "rollNumber": "0",
                "isExternal": 0,
                "department": 1,
                "siteLocation": 1
            }

            openmrsRest.create("savicsgmao/agent", region2).then(function (response) {
                console.log(response)
            })
        }

        

    }]);