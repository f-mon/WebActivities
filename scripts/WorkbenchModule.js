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
        $scope.activeActivity = null;

        $scope.startAsChild = false;

        $scope.$on('activityStartedEvent', function (event, activity) {
            $scope.activeActivity = activity;
            if (activity != null) {
                activity.showInto($("#activities-container"));
            }
        });

        $scope.$on('activityStoppedEvent', function (event, activity) {
            if ($scope.activeActivity == activity) {
                $scope.activeActivity = null;
            }
        });

        $scope.$on('activityResumedEvent', function (event, activity) {
            $scope.activeActivity = activity;
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
