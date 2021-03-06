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
            },
            breadcrumbs: ["Home"]
        }).state('home.error', {
            url: 'error',
            template: '<div>Error 404</div>',
        }).state('home.equipments', {
            url: 'equipments',
            template: require('./equipment/equipments.html'),
            controller: 'EquipmentController',
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
            breadcrumbs: ["Home", "Equipments"]
        }).state('home.equipment', {
            url: 'equipment',
            template: require('./equipment/equipment.html'),
            controller: 'EquipmentController',
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
            breadcrumbs: ["Home", "Equipments", "Ajout/Modification"]
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
        }).state('home.operationApproval', {
            url: 'operationApproval',
            template: require('./operation/operationApproval.html'),
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
            breadcrumbs: ["Home", "Operations", "Approval"]
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
        }).state('home.departments', {
            url: 'departments',
            template: require('./settings/departments.html'),
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
            breadcrumbs: ["Home", "Settings", "Departments"]
        }).state('home.agents', {
            url: 'agents',
            template: require('./settings/agents.html'),
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
            breadcrumbs: ["Home", "Settings", "Agents"]
        }).state('home.settings', {
            url: 'settings',
            template: require('./settings/settings.html'),
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
            breadcrumbs: ["Home", "Settings"]
        }).state('home.sites', {
            url: 'sites',
            template: require('./settings/sites.html'),
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
            breadcrumbs: ["Home", "Settings", "Sites"]
        });

        //$urlRouterProvider.otherwise('/error');
        //$locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$state', '$transitions', 'openmrsTranslate', function ($rootScope, $state, $transitions, openmrsTranslate) {
        $rootScope.kernel = {

        }


        //CHange language function
        $rootScope.changeLanguage = function (langKey) {
            return openmrsTranslate.changeLanguage(langKey);
        };


        //$state.go('home.dashboard.main');
        $transitions.onStart({}, function (trans) {

            var nextState = trans.to();

            $rootScope.kernel.isMain = true;
            $rootScope.kernel.version = "1.0.0";
            $rootScope.kernel.released = "00/00/0000";
            $rootScope.state = nextState.name;

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
