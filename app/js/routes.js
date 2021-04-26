angular.module('routes', []).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

        $urlRouterProvider
        .when('', '/');

        $stateProvider.state('home', {
            abstract: true,
            url: '/',
            views: {
                'header': {
                    template: require('./templates/header.html')
                },
                'content': {
                    template: require('./templates/home.html')
                },
                'footer': {
                    template: require('./templates/footer.html')
                }
            }
        }).state('home.dashboard', {// Define home page
            abstract: true,
            url: '',
            template: require('./dashboard/dashboard.html')
        }).state('home.dashboard.main', {// Define dashboard page
            url: '',
            template: require('./dashboard/main.html'),
            controller: 'DashboardController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./dashboard/DashboardController.js');
                        $ocLazyLoad.load({
                            name: 'DashboardController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            }
        }).state('home.error', {
            url: 'error',
            template: '<div>Error 404</div>',
        }).state('home.equipements', {
            url: 'equipements',
            template: require('./equipement/equipements.html'),
            controller: 'EquipementController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./equipement/EquipementController.js');
                        $ocLazyLoad.load({
                            name: 'EquipementController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Equipements"]
        }).state('home.equipement', {
            url: 'equipement',
            template: require('./equipement/equipement.html'),
            controller: 'EquipementController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./equipement/EquipementController.js');
                        $ocLazyLoad.load({
                            name: 'EquipementController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Equipements", "Ajout/Modification"]
        }).state('home.agents', {
            url: 'agents',
            template: require('./agent/agents.html'),
            controller: 'AgentController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./agent/AgentController.js');
                        $ocLazyLoad.load({
                            name: 'AgentController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Agents"]
        }).state('home.agent', {
            url: 'agent/:id',
            template: require('./agent/agent.html'),
            controller: 'AgentsController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./agent/AgentController.js');
                        $ocLazyLoad.load({
                            name: 'AgentsController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Agents", "Ajout/Modofication"]
        }).state('home.maintenances', {
            url: 'maintenances',
            template: require('./maintenance/maintenances.html'),
            controller: 'MaintenanceController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./maintenance/MaintenanceController.js');
                        $ocLazyLoad.load({
                            name: 'MaintenanceController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Maintenances"]
        }).state('home.maintenance', {
            url: 'maintenance',
            template: require('./maintenance/maintenance.html'),
            controller: 'MaintenanceController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./maintenance/MaintenanceController.js');
                        $ocLazyLoad.load({
                            name: 'MaintenanceController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Maintenances", "Ajout/Modification"]
        }).state('home.request', {
            url: 'request',
            template: require('./maintenance/request.html'),
            controller: 'MaintenanceController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./maintenance/MaintenanceController.js');
                        $ocLazyLoad.load({
                            name: 'MaintenanceController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Maintenances", "Request"]
        }).state('home.schedule', {
            url: 'schedule',
            template: require('./maintenance/schedule.html'),
            controller: 'MaintenanceController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./maintenance/MaintenanceController.js');
                        $ocLazyLoad.load({
                            name: 'MaintenanceController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Maintenances", "Schedule"]
        }).state('home.operations', {
            url: 'operations',
            template: require('./operation/operations.html'),
            controller: 'OperationController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./operation/OperationController.js');
                        $ocLazyLoad.load({
                            name: 'OperationController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Operations"]
        }).state('home.operation', {
            url: 'operation',
            template: require('./operation/operation.html'),
            controller: 'OperationController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./operation/OperationController.js');
                        $ocLazyLoad.load({
                            name: 'OperationController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Operations", "Edit"]
        }).state('home.maintenanceReasons', { 
            url: 'maintenanceReasons',
            template: require('./settings/maintenanceReasons.html'),
            controller: 'SettingsController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./settings/SettingsController.js');
                        $ocLazyLoad.load({
                            name: 'SettingsController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Settings", "Maintenance reasons"]
        }).state('home.equipmentTypes', { 
            url: 'equipmentTypes',
            template: require('./settings/equipmentTypes.html'),
            controller: 'SettingsController',
            resolve: {
                loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        var mod = require('./settings/SettingsController.js');
                        $ocLazyLoad.load({
                            name: 'SettingsController'
                        });
                        deferred.resolve(mod.controller);
                    });
                    return deferred.promise;
                }]
            },
            breadcrumbs: ["Home", "Settings", "Equipment types"]
        });

        //$urlRouterProvider.otherwise('/error');
        //$locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$state', '$transitions', function ($rootScope, $state, $transitions) {
        $rootScope.kernel = {

        }
        //$state.go('home.dashboard.main');
        console.log($state);
        $transitions.onStart({}, function (trans) {

            var nextState = trans.to();

            $rootScope.kernel.isMain = true;
            $rootScope.kernel.version = "1.0.0";
            $rootScope.kernel.released = "00/00/0000";
            $rootScope.state = nextState.name;
            console.log(nextState);

            // Build the breadcrumb
            if (nextState.breadcrumbs) {
                $rootScope.kernel.isMain = false;
                $rootScope.kernel.breadcrumbs = [];
                var i;
                for (i = 0; i < nextState.breadcrumbs.length; i++) {
                    $rootScope.kernel.breadcrumbs.push(nextState.breadcrumbs[i]);
                }
            }

            // Go to a state
            $rootScope.href = function (state) {
                $state.go(state);
            }
        });
    }]);
