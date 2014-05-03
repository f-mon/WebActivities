define(["angular","scripts/Activity"], function (a,Activity) {

    var ActivityManager = function ($rootScope) {

        var activityDefinitions = [];
        var activitiesStack = [];

        var top = function() {
            if (activitiesStack.length>0) {
                return activitiesStack[activitiesStack.length-1];
            } else {
                return null;
            }
        };

        this.activityDefinitions = activityDefinitions;
        this.activitiesStack = activitiesStack;

        this.startRootActivity = function (activityDefinitionName, configs) {
            return this.stopAllActivities().then(this.startOneActivity(activityDefinitionName));
        };

        this.startChildActivity = function (activityDefinitionName, configs) {
            var self= this;
            return self.pauseCurrentActivity().then(this.startOneActivity(activityDefinitionName));
        };

        this.startOneActivity = function(activityDefinitionName) {
            var self = this;
            return new Promise(function(resolve,reject) {
                var activityDefinition = self.getActivityDefinition(activityDefinitionName);
                if (activityDefinition==null) {
                    reject(new Error("Nessuna activity Definition trovata con nome: "+activityDefinitionName));
                }
                var newActivity = new Activity(activityDefinition);
                self.activitiesStack.push(newActivity);
                $rootScope.$broadcast("activityStartedEvent",newActivity);
                resolve(newActivity);
            });
        }

        this.stopAllActivities = function() {
            if (top()==null) {
                return Promise.resolve(null);
            }
            var self= this;
            return this.stopCurrentActivity().then(this.stopAllActivities());
        };

        this.stopOneActivity = function() {
            var currentActivity = top();
            if (currentActivity==null) {
                return Promise.resolve(null);
            }
            var self= this;
            self.activitiesStack.splice(self.activitiesStack.length-1,1);
            return currentActivity.stop().then(function() {
                $rootScope.$broadcast("activityStoppedEvent",currentActivity);
            });
        };

        this.pauseCurrentActivity = function () {
            var currentActivity = top();
            if (currentActivity==null) {
                return Promise.resolve(null);
            }
            return currentActivity.pause().then(function() {
                $rootScope.$broadcast("activityPausedEvent",currentActivity);
            });
        };

        this.resumeOneActivity = function() {
            var toBeResumedActivity = top();
            if (toBeResumedActivity==null) {
                return Promise.resolve(null);
            }
            return toBeResumedActivity.resume().then(function() {
                $rootScope.$broadcast("activityResumedEvent",toBeResumedActivity);
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

        this.stopCurrentActivity = function () {
            var self= this;
            return this.stopOneActivity().then(function() {
                return self.resumeOneActivity();
            });
        };

    };

    return ActivityManager;
});
