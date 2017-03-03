(function () {
    'use strict';

    const moment = nodeRequire('moment/moment.js');

    angular.module('app')
        .controller('ComplaintsCtrl', ['$mdDialog', '$sce', '$rootScope', '$scope', ComplaintsCtrl])

    function ComplaintsCtrl($mdDialog, $sce, $root, $scope) {

        let time = moment();

        time.date(time.date()-5);

        $scope.currentDate = time.format('YYYY-MM-DD hh:mm:ss');

    }

})();
