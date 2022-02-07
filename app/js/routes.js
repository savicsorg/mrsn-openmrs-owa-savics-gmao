angular.module('routes', []).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $urlRouterProvider.when('', '/');
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
    }).state('home.dashboard', {
        abstract: true,
        url: '',
        template: require('./dashboard/dashboard.html')
    }).state('home.dashboard.main', {
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
    }).state('home.equipments', {
        url: 'equipments',
        template: require('./equipment/equipments.html'),
        controller: 'EquipmentsController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./equipment/EquipmentsController.js');
                    $ocLazyLoad.load({
                        name: 'EquipmentsController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.equipment', {
        url: 'equipment',
        params: {
            equipment_id: undefined,
            data: undefined
        },
        template: require('./equipment/equipment.html'),
        controller: 'EquipmentController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./equipment/EquipmentController.js');
                    $ocLazyLoad.load({
                        name: 'EquipmentController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.maintenancemanagement', {
        url: 'maintenancemanagement',
        template: require('./maintenance/maintenanceManagement.html'),
        controller: 'MaintenanceManagementController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./maintenance/MaintenanceManagementController.js');
                    $ocLazyLoad.load({
                        name: 'MaintenanceManagementController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.maintenances', {
        url: 'maintenances',
        template: require('./maintenance/maintenances.html'),
        controller: 'MaintenancesController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./maintenance/MaintenancesController.js');
                    $ocLazyLoad.load({
                        name: 'MaintenancesController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.maintenance', {
        url: 'maintenance',
        params: {
            maintenance_id: undefined,
            data: undefined
        },
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
        }
    }).state('home.requests', {
        url: 'requests',
        template: require('./maintenance/requests.html'),
        controller: 'RequestsController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./maintenance/RequestsController.js');
                    $ocLazyLoad.load({
                        name: 'RequestsController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.request', {
        url: 'request',
        params: {
            request_id: undefined,
            data: undefined
        },
        template: require('./maintenance/request.html'),
        controller: 'RequestController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./maintenance/RequestController.js');
                    $ocLazyLoad.load({
                        name: 'RequestController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.movements', {
        url: 'movements',
        template: require('./movement/movements.html'),
        controller: 'MovementsController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./movement/MovementsController.js');
                    $ocLazyLoad.load({
                        name: 'MovementsController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.movement', {
        url: 'movement',
        params: {
            operation_id: undefined,
            equipment_id: undefined,
            canBeValidated: undefined,
            data: undefined
        },
        template: require('./movement/movement.html'),
        controller: 'MovementController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./movement/MovementController.js');
                    $ocLazyLoad.load({
                        name: 'MovementController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.movementApproval', {
        url: 'movementApproval',
        template: require('./movement/movementApproval.html'),
        controller: 'MovementApprovalController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./movement/MovementApprovalController.js');
                    $ocLazyLoad.load({
                        name: 'MovementApprovalController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
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
        }
    }).state('home.equipmentTypes', {
        url: 'equipmentTypes',
        template: require('./settings/equipmentTypes.html'),
        controller: 'EquipmentTypesController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./settings/EquipmentTypesController.js');
                    $ocLazyLoad.load({
                        name: 'EquipmentTypesController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.districts', {
        url: 'districts',
        template: require('./settings/districts.html'),
        controller: 'DistrictsController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./settings/DistrictsController.js');
                    $ocLazyLoad.load({
                        name: 'DistrictsController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.sites', {
        url: 'sites',
        template: require('./settings/sites.html'),
        controller: 'SitesController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./settings/SitesController.js');
                    $ocLazyLoad.load({
                        name: 'SitesController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.services', {
        url: 'services',
        template: require('./settings/services.html'),
        controller: 'ServicesController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./settings/ServicesController.js');
                    $ocLazyLoad.load({
                        name: 'ServicesController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    }).state('home.healthCenters', {
        url: 'healthCenters',
        template: require('./settings/healthCenters.html'),
        controller: 'HealthCentersController',
        resolve: {
            loadMyCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                    var mod = require('./settings/HealthCentersController.js');
                    $ocLazyLoad.load({
                        name: 'HealthCentersController'
                    });
                    deferred.resolve(mod.controller);
                });
                return deferred.promise;
            }]
        }
    });
}]).run(['$rootScope', '$state', '$transitions', 'openmrsTranslate', 'openmrsRest', function ($rootScope, $state, $transitions, openmrsTranslate, openmrsRest) {
    var _ = require("underscore");
    $rootScope.kernel = {

    }
    if (!$rootScope.account) {
        $rootScope.account = {};
    }

    $rootScope.selectedLanguage = "fr";

    //CHange language function
    $rootScope.changeLanguage = function (langKey) {
        $rootScope.selectedLanguage = langKey;
        return openmrsTranslate.changeLanguage(langKey);
    };

    $rootScope.changeLanguage('fr');

    openmrsRest.getFull("session").then(function (response) {
        $rootScope.account = response.user;
    }, function (e) {
        console.error(e);
    });

    if (!$rootScope.selectedLanguage) {
        $rootScope.selectedLanguage = 'en';
    }

    if (!$rootScope.account) {
        $rootScope.account = {};
    }

    $rootScope.changeLanguage($rootScope.selectedLanguage);

    openmrsRest.getFull("session").then(function (response) {
        $rootScope.account = response.user;
        if (_.some(response.user.roles, function (item) {
            return item.display === "GMAO: Administrateur" || item.name === "GMAO: Administrateur" || item.name === "System Developer";
        })) {
            $rootScope.account.role = 1;
        } else if (_.some(response.user.roles, function (item) {
            return item.display === "GMAO: Responsable" || item.name === "GMAO: Responsable";
        })) {
            $rootScope.account.role = 2;
        } else if (_.some(response.user.roles, function (item) {
            return item.display === "GMAO: Gestionnaire" || item.name === "GMAO: Gestionnaire";
        })) {
            $rootScope.account.role = 3;
        } 
        console.log('$rootScope.account=');
        console.log($rootScope.account);
    }, function (e) {
        console.log(e);
    });

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

        $rootScope.changeLanguage('fr');
    });
}]);