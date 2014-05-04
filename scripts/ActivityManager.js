angular.module('WorkbenchModule')

    .factory('ActivityManager', function ($rootScope,$q,Activity) {

        var ActivityManager = function () {

            var activityDefinitions = [];
            var activitiesStack = [];

            var top = function () {
                if (activitiesStack.length > 0) {
                    return activitiesStack[activitiesStack.length - 1];
                } else {
                    return null;
                }
            };

            this.activityDefinitions = activityDefinitions;
            this.activitiesStack = activitiesStack;

            this.startRootActivity = function (activityDefinitionName, configs) {
                var self = this;
                return this.stopAllActivities().then(function () {
                    self.startOneActivity(activityDefinitionName);
                });
            };

            this.startChildActivity = function (activityDefinitionName, configs) {
                var self = this;
                return self.pauseCurrentActivity().then(function () {
                    self.startOneActivity(activityDefinitionName);
                });
            };

            this.startOneActivity = function (activityDefinitionName) {
                var self = this;
                var deferred = $q.defer();

                var activityDefinition = self.getActivityDefinition(activityDefinitionName);
                if (activityDefinition == null) {
                    deferred.reject(new Error("Nessuna activity Definition trovata con nome: " + activityDefinitionName));
                }
                var newActivity = new Activity(activityDefinition);
                self.activitiesStack.push(newActivity);

                $rootScope.$broadcast("activityStartedEvent", newActivity);
                deferred.resolve(newActivity);

                return deferred.promise;
            }

            this.stopAllActivities = function () {
                if (top() == null) {
                    return  $q.when(null);
                }
                var self = this;
                return this.stopCurrentActivity().then(function () {
                    return self.stopAllActivities();
                });
            };

            this.stopCurrentActivity = function () {
                var self = this;
                return this.stopOneActivity().then(function () {
                    return self.resumeOneActivity();
                });
            };

            this.stopOneActivity = function () {
                var currentActivity = top();
                if (currentActivity == null) {
                    return $q.when(null);
                }
                var self = this;
                return currentActivity.stop().then(function () {
                    self.activitiesStack.splice(self.activitiesStack.length - 1, 1);
                    $rootScope.$broadcast("activityStoppedEvent", currentActivity);
                });
            };

            this.pauseCurrentActivity = function () {
                var currentActivity = top();
                if (currentActivity == null) {
                    return $q.when(null);
                }
                return currentActivity.pause().then(function () {
                    $rootScope.$broadcast("activityPausedEvent", currentActivity);
                });
            };

            this.resumeOneActivity = function () {
                var toBeResumedActivity = top();
                if (toBeResumedActivity == null) {
                    return $q.when(null);
                }
                return toBeResumedActivity.resume().then(function () {
                    $rootScope.$broadcast("activityResumedEvent", toBeResumedActivity);
                });
            };

            this.getActivityDefinition = function (activityDefinitionName) {
                for (var i = 0; i < this.activityDefinitions.length; i++) {
                    var obj = this.activityDefinitions[i];
                    if (obj.name == activityDefinitionName) {
                        return obj;
                    }
                }
                return null;
            };

            this.registerActivity = function (activityDefinition) {
                this.activityDefinitions.push(activityDefinition);
            };

        };

        return ActivityManager;
    });
