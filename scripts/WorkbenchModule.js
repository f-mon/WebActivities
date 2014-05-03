define(["jquery", "angular", "scripts/Activity", "scripts/ActivityManager"], function ($, a, Activity, ActivityManager) {

    var module = angular.module('WorkbenchModule', []);

    module.factory('activityManager',function($rootScope) {
        var activityManager = new ActivityManager($rootScope);
        window.activityManager = activityManager;
        return activityManager;
    });

    module.controller('WorkbenchController', function ($scope, activityManager) {

        $scope.activitiesStack = activityManager.activitiesStack;
        $scope.activityDefinitions = activityManager.activityDefinitions;

        $scope.startAsChild = false;

        $scope.$on('activityStartedEvent', function (event, activity) {
            if (activity != null) {
                activity.showInto($("#activities-container"));
            }
        });

        $scope.fireStopCurrentActivity = function () {
            activityManager.stopCurrentActivity();
        };

        $scope.startRootActivity = function (activityDef) {
            if ($scope.startAsChild) {
                activityManager.startChildActivity(activityDef.name);
            } else {
                activityManager.startRootActivity(activityDef.name);
            }
        };

    });

    return module;
});
