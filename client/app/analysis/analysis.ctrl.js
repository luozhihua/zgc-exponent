(function () {
    'use strict';

    const {BrowserWindow} = nodeRequire('electron').remote;
    const _ = nodeRequire('lodash');
    const ProductsNationwide = nodeRequire('./libs/products.all.js');
    const getImgs = nodeRequire('./libs/img.js');
    const LOCAL_GOV = 'sichuan';

    angular.module('app')
        .controller('AnalysisCtrl', ['$mdDialog', '$sce', '$rootScope', '$scope', AnalysisCtrl])

    function AnalysisCtrl($mdDialog, $sce, $root, $scope) {

        let html = `
                <h3>统计分析</h3>
                <p>...</p>
        `


    }

})();
