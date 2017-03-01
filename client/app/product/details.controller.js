(function () {
    'use strict';

    const {BrowserWindow} = nodeRequire('electron').remote;
    const ProductsNationwide = nodeRequire('./libs/products.all.js');
    const getDetails = nodeRequire('./libs/details.js');
    const getBidInfo = nodeRequire('./libs/bid-info.js');
    const getImgs = nodeRequire('./libs/img.js');
    const _ = nodeRequire('lodash');
    const LOCAL_GOV = 'sichuan';

    angular.module('app')
        .controller('detailsController', ['$mdDialog', '$rootScope', '$scope', '$stateParams', detailsController]);

    function detailsController($mdDialog, $root, $scope, $stateParams) {

        let product;
        let id = $stateParams.id;
        let nationwide = window.db = new ProductsNationwide() || window.db;

        nationwide.open().then(function() {

            $scope.showOtherPrice = 'ec';
            $scope.productProps = nationwide.getProductById(id);
            $scope.zhishu = nationwide.zscxj(id);

            $scope.avergeEc = nationwide.avergeEcQuanzhong(id);
            $scope.avergeGov = nationwide.avergeGovQuanzhong(id);

            $scope.govOffset = nationwide.govOffset(id);
            $scope.ecOffset = nationwide.ecOffset(id);
            $scope.marketOffset = nationwide.marketOffset(id);

            $scope.avergeModelOfMarket = nationwide.getModelAvergeOfMarket(id);
            $scope.avergeModelOfEc = nationwide.getModelAvergeOfEc(id);
            $scope.avergeModelOfGov = nationwide.getModelAvergeOfGov(id);
            $scope.avergeModel = nationwide.getModelAverge(id);

            $scope.offsetModelOfMarket = nationwide.getModelOffsetOfMarket(id);
            $scope.offsetModelOfEc = nationwide.getModelOffsetOfEc(id);
            $scope.offsetModelOfGov = nationwide.getModelOffsetOfGov(id);

            $scope.ecList = _.filter(nationwide.getProductsOfAllEcoms(id), function(o){return o.price!==0; });
            $scope.govList = _.filter(nationwide.getProductsOfAllGovs(id), function(o){return o.price!==0; });
        });

        // 读取商品图片
        getImgs().then(function(map) {
            $scope.productImg = map[id];
        });

        // 读取中标信息
        getBidInfo().then(function(map) {
            $scope.productBid = map[id];
        });

        // 读取单品参数
        getDetails().then(function(details) {
            $scope.productDetails = details[id];
        });

    }

}());
