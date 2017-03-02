(function () {
    'use strict';

    angular.module('app.page')
    .controller('invoiceCtrl', ['$scope', '$window', invoiceCtrl])
    .controller('authCtrl', ['$scope', '$window', '$location', authCtrl]);

    function invoiceCtrl($scope, $window) {
        var printContents, originalContents, popupWin;

        $scope.printInvoice = function() {
            printContents = document.getElementById('invoice').innerHTML;
            originalContents = document.body.innerHTML;
            popupWin = window.open();
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
    }

    function authCtrl($scope, $window, $location) {

        const {BrowserWindow} = nodeRequire('electron').remote;
        const win = BrowserWindow.getFocusedWindow();

        // win.setSize(640, 560, true);
        if (window.firstLogin === false) {
            // win.setPosition(200, 200, true);
        }
        window.firstLogin = false;

        $scope.login = function() {
            $scope.hide = true;
             $('.page-signin').hide();
            // win.maximize();

             setTimeout(function() {

                $location.url('/')
                $scope.$apply();
             }, 500);
        }

        $scope.signup = function() {
            $location.url('/')
        }

        $scope.reset =    function() {
            $location.url('/')
        }

        $scope.unlock =    function() {
            $location.url('/')
        }

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $scope.hide = true;
// alert(9)
            $('.page-signin').hide();
        });

    }

})();



