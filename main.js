
require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        angular: 'bower_components/angular/angular'
    }
});


require(['sample/AppModule'], function() {

    angular.bootstrap(document, ['AppModule']);

});

