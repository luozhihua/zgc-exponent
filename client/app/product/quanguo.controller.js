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
        .controller('quanguoController', ['$mdDialog', '$rootScope', '$scope', '$stateParams', quanguoController]);

    function quanguoController($mdDialog, $root, $scope, $stateParams) {

        let IMGS;
        let product;
        let id = $stateParams.id;
        let nationwide = window.db = new ProductsNationwide() || window.db;

        nationwide.open().then(function() {

            $scope.tree = nationwide.getCategoryFlatTree();

            // 读取商品图片
            getImgs().then(function(map) {
                IMGS = map;
                $scope.update();
            });
        });


        $scope.getZhishu = function(id) {
            return {
                productProps : nationwide.getProductById(id),
                zhishu : nationwide.zscxj(id),

                avergeEc : nationwide.avergeEcQuanzhong(id),
                avergeGov : nationwide.avergeGovQuanzhong(id),

                govOffset : nationwide.govOffset(id),
                ecOffset : nationwide.ecOffset(id),
                marketOffset : nationwide.marketOffset(id),

                avergeModelOfMarket : nationwide.getModelAvergeOfMarket(id),
                avergeModelOfEc : nationwide.getModelAvergeOfEc(id),
                avergeModelOfGov : nationwide.getModelAvergeOfGov(id),
                avergeModel : nationwide.getModelAverge(id),

                offsetModelOfMarket : nationwide.getModelOffsetOfMarket(id),
                offsetModelOfEc : nationwide.getModelOffsetOfEc(id),
                offsetModelOfGov : nationwide.getModelOffsetOfGov(id),

                ecList : _.filter(nationwide.getProductsOfAllEcoms(id), function(o){return o.price!==0; }),
                govList : _.filter(nationwide.getProductsOfAllGovs(id), function(o){return o.price!==0; })
            }
        }

        $scope.update = function(catelog) {
            let productList;
            let cateName;

            if (!catelog) {
                productList = nationwide.tables[0];
            } else if (catelog.type == 'category') {
                productList = nationwide.getProductByCategory(catelog.name);
            } else {
                productList = nationwide.getProductByModel(catelog.name);
                cateName = catelog.name
            }

            cateName = cateName || productList.length>0 ? productList[0].model : null;
            $scope.categoryName = cateName;

            if (cateName) {

                $scope.averge = nationwide.getModelAverge(cateName);
                $scope.avergeOfMarket = nationwide.getModelAvergeOfMarket(cateName);
                $scope.avergeOfEc = nationwide.getModelAvergeOfEc(cateName);
                $scope.avergeOfGov = nationwide.getModelAvergeOfGov(cateName);

                $scope.offsetOfMarket = nationwide.getModelOffsetOfMarket(cateName);
                $scope.offsetOfEc = nationwide.getModelOffsetOfEc(cateName);
                $scope.offsetOfGov = nationwide.getModelOffsetOfGov(cateName);
            }

            productList = _.slice(productList, 0, 5);

            productList = _.map(productList, function(prod) {
                prod.zhishuDetails =  $scope.getZhishu(prod.id);
                prod.img = IMGS[prod.id];
                return prod;
            });

            $scope.productList = productList;
        }

    }

}());
