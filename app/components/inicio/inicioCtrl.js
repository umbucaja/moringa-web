angular.module('routerApp').controller('inicioCtrl', function ($scope, InicioSrvc) {

    var map;
    $scope.inputSearch = '';
    $scope.city = {};
    $scope.watersource = {};
    $scope.watersources = [];
    $scope.changeWatersource = changeWatersource;

    initialize();

    function initialize() {
        geolocation();
    }

    function geolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
        } else {
            //TODO: No native support; Query IP geolocation
        }
    }

    function geolocationSuccess(position) {
        // Geolocation avaliable. Let's show a map!
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        loadMap(lat, lng);
    }

    function geolocationError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.");
                break;
        }
    }

    function loadMap(lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);

        var options = {
            zoom: 12,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("mapa"), options);

        loadWatersourceData();
    }

    function loadWatersourceData() {
        InicioSrvc.geocodeCityName(map.center).then(geocodeCitySuccess, geocodeCityError);

        function geocodeCitySuccess(cityName) {
            InicioSrvc.queryCityByName(cityName).then(queryCityByNameSuccess, queryCityByNameError);
            $scope.inputSearch = cityName;

            function queryCityByNameSuccess(city) {
                $scope.city = city;
                InicioSrvc.queryWatersources(city.id).then (queryWatersourcesSuccess, queryWatersourcesError);

                function queryWatersourcesSuccess(watersources) {
                    $scope.watersources = watersources;
                    $scope.watersource = watersources[0];
                }

                function queryWatersourcesError(error) {
                    console.log(error);
                }
            }

            function queryCityByNameError(error) {
                console.log(error);
            }
        }

        function geocodeCityError(error) {
            console.log(error);
        }
    }

    function changeWatersource(watersource) {

    }

    var chart = c3.generate({
        data: {
            x: 'x',
    //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
            columns: [
                ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
    //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 130, 340, 200, 500, 250, 350]
            ]
        },
        subchart : {
            show : true
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            }
        }
    });

});