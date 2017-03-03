(function () {
    'use strict';

    const moment = nodeRequire('moment');

    angular.module('app')
        .controller('ComplaintsCtrl', ['$mdDialog', '$sce', '$rootScope', '$scope', ComplaintsCtrl])

    function ComplaintsCtrl($mdDialog, $sce, $root, $scope) {

        let time = moment();
        $scope.currentDate = time.format('YYYY-MM-DD hh:mm:ss');

    }

})();
