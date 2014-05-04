angular.module('WorkbenchModule')

    .factory('Activity', function () {

        var activityInstanceIdCounter = 0;

        var Activity = function (activityDefinition) {
            this.activityDefinition = activityDefinition;
            this.activityInstanceId = activityInstanceIdCounter++;
            this.view = null;
        };

        Activity.prototype.onCreate = function (savedInstanceState) {

        };
        Activity.prototype.onStart = function () {

        };
        Activity.prototype.onResume = function () {

        };
        Activity.prototype.onPause = function () {

        };
        Activity.prototype.onStop = function () {

        };
        Activity.prototype.onDestroy = function () {

        };
        Activity.prototype.stopped = function () {

        };

        Activity.prototype.getView = function () {
            if (this.view != null) {
                return Promise.resolve(this.view);
            }
            var self = this;
            if (this.activityDefinition.iframe) {
                return this.iframeViewLoad().then(function (view) {
                    self.view = view;
                    return view;
                });
            } else {
                return this.templateViewLoad().then(function (view) {
                    self.view = view;
                    return view;
                });
            }
        };

        Activity.prototype.iframeViewLoad = function () {
            var element = $("<iframe src='" + this.activityDefinition.url + "' id='activity_" + this.activityInstanceId + "' class='activity-container' ></iframe>");
            return Promise.resolve(element);
        };

        Activity.prototype.templateViewLoad = function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                var element = $("<div id='activity_" + self.activityInstanceId + "' class='activity-container' ></div>");
                element.load(self.activityDefinition.template, function () {
                    resolve(element);
                });
            });
        };

        Activity.prototype.pause = function () {
            var self = this;
            return this.getView().then(function (view) {
                self.hostElement = view.parent();
                if (self.activityDefinition.iframe) {
                    view.hide();
                } else {
                    view.remove();
                }
            });
        };

        Activity.prototype.resume = function () {
            var self = this;
            return this.getView().then(function (view) {
                if (self.activityDefinition.iframe) {
                    view.show();
                } else {
                    self.hostElement.append(view);
                }
            });
        };

        Activity.prototype.stop = function () {
            var self = this;
            //testing waiting stop
            var stopping = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, 100);
            });
            return stopping.then(function () {
                return self.getView().then(function (view) {
                    view.remove();
                });
            });
        };

        Activity.prototype.showInto = function (hostElement) {
            return this.getView().then(function (view) {
                hostElement.append(view);
            });
        };

        return Activity;


    });