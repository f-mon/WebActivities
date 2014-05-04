angular.module('AppModule', ['WorkbenchModule'])
    .run(function (activityManager) {

        activityManager.registerActivity({
            name: "testActivity",
            template: "sample/testActivity.html",
            startable: true
        });

        activityManager.registerActivity({
            name: "test2Activity",
            template: "sample/test2Activity.html",
            startable: true
        });

        activityManager.registerActivity({
            name: "testIframed",
            iframe: true,
            url: "http://www.repubblica.it/",
            startable: true
        });

    });
