(function () {
    'use strict';

    const {BrowserWindow} = nodeRequire('electron').remote;
    const ProductsNationwide = nodeRequire('./libs/products.all.js');
    const getDetails = nodeRequire('./libs/details.js');
    const getBidInfo = nodeRequire('./libs/bid-info.js');
    const getImgs = nodeRequire('./libs/img.js');
    const _ = nodeRequire('lodash');

    angular.module('app')
        .controller('quanguoController', ['$mdDialog', '$rootScope', '$scope', '$stateParams', quanguoController]);

    function quanguoController($mdDialog, $root, $scope, $stateParams) {

        let IMGS;
        let product;
        const AREA = $stateParams.area;
        const LOCAL_GOV = $stateParams.gov || 'sichuan';

        let nationwide = window.db = new ProductsNationwide() || window.db;

        $scope.AREA = AREA;
        $scope.LOCAL_GOV = LOCAL_GOV;

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

            if ($scope.AREA === 'local') {
                let nameKey = 'gov_' + LOCAL_GOV + '_productName';
                let priceKey = 'gov_' + LOCAL_GOV + '_productPrice';
                let filter = {};

                productList = _.filter(productList, function(o) {
                    return o[nameKey] !== '' && o[priceKey] !== 0;
                });
            }

            cateName = cateName || (productList.length>0 ? productList[0].model : null);
            $scope.categoryName = cateName;

            if (cateName) {

                $scope.averge = nationwide.getModelAverge(cateName);
                $scope.avergeOfMarket = nationwide.getModelAvergeOfMarket(cateName);
                $scope.avergeOfEc = nationwide.getModelAvergeOfEc(cateName);
                $scope.avergeOfGov = nationwide.getModelAvergeOfGov(cateName);

                $scope.marketOffset = nationwide.getModelOffsetOfMarket(cateName);
                $scope.ecOffset = nationwide.getModelOffsetOfEc(cateName);
                $scope.govOffset = nationwide.getModelOffsetOfGov(cateName);
            }

            // productList = _.slice(productList, 0, 5);

            productList = _.map(productList, function(prod) {
                prod.zhishuDetails =  $scope.getZhishu(prod.id);
                prod.img = IMGS[prod.id];
                return prod;
            });

            $scope.productList = productList;
        }


        $scope.showScreen = function(product) {

            let originName = product.ecName || product.govName;
            let imgUrl = 'assets/products/'+ product.category +'/' + product.id + '-' + originName + '.jpg';
            let link = product.link;

            $mdDialog.show({
              templateUrl: 'app/product/details-originpage.html',
              parent: angular.element(document.body),
              // targetEvent: ev,
              clickOutsideToClose:true,
              controller: ['$scope', '$sce', function($dscope, $sce) {


                $dscope.link = link;
                $dscope.imgUrl = imgUrl;
                $dscope.originName = originName;

                $dscope.getLink = function() {
                    return $sce.trustAsResourceUrl(link);
                }
                $dscope.hide = function() {
                    $mdDialog.hide();
                }
              }]
            });
        }


        /**
         *  表格
         */
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];
        $scope.pgLabel = {
            "of": '共',
            "page": '页码:',
            "rowsPerPage": '每页显示:'
        }

        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.getTypes = function () {
            return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };

        $scope.loadStuff = function () {
            $scope.promise = $timeout(function () {
                // loading
            }, 2000);
        }

        $scope.logItem = function (item) {
            console.log(item.name, 'was selected');
        };

        $scope.logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope.logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        }
        // end 表格

    }

}());
