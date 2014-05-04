angular.module('WorkbenchModule', [])

    .factory('activityManager', function (ActivityManager) {
        var activityManager = new ActivityManager();
        window.activityManager = activityManager;
        return activityManager;
    })

    .controller('WorkbenchController', function ($scope, activityManager) {

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

