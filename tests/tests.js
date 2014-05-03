test( "ActivityManager", function() {

    ok( ActivityManager, "ActivityManager exists" );

    ActivityManager.registerActivity({
        id: 'testActivity'
    });

});