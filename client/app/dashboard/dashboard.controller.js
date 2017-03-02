(function () {
    'use strict';

    const {BrowserWindow} = nodeRequire('electron').remote;
    const ProductsNationwide = nodeRequire('./libs/products.all.js');
    const getImgs = nodeRequire('./libs/img.js');
    const _ = nodeRequire('lodash');
    const LOCAL_GOV = 'sichuan';

    let overtop_less,
        overtop_0_10,
        overtop_10_20,
        overtop_20_50,
        overtop_50,
        groups = {};
    let nationwide = window.db = new ProductsNationwide();
    nationwide.open().then(function(x,y,z) {

        overtop_less = nationwide.getProducrsOvertop(LOCAL_GOV, -2000, 10);
        overtop_0_10 = nationwide.getProducrsOvertop(LOCAL_GOV, 0, 10);
        overtop_10_20 = nationwide.getProducrsOvertop(LOCAL_GOV, 10, 20);
        overtop_20_50 = nationwide.getProducrsOvertop(LOCAL_GOV, 20, 50);
        overtop_50 = nationwide.getProducrsOvertop(LOCAL_GOV, 50);

        groups['overtop_less'] = _.groupBy(overtop_less, 'category');
        groups['overtop_0_10'] = _.groupBy(overtop_0_10, 'category');
        groups['overtop_10_20'] = _.groupBy(overtop_10_20, 'category');
        groups['overtop_20_50'] = _.groupBy(overtop_20_50, 'category');
        groups['overtop_50'] = _.groupBy(overtop_50, 'category');
    });

    let getPie2Data = function(groupName) {
        var categorys = groups[groupName];
        var legendData = [];
        var data = [];
        var legend;

        for (var k in categorys) {
            legend = k + '('+ categorys[k].length +')'
            data.push({
                value: categorys[k].length,
                name: legend,
                category: k,
                alias: groupName,
                childred: categorys[k]
            });
            legendData.push(legend);
        }

        return [data, legendData];
    }

    angular.module('app')
        .controller('DashboardCtrl', ['$mdDialog', '$rootScope', '$scope', DashboardCtrl])

    function DashboardCtrl($mdDialog, $root, $scope) {

        // const win = BrowserWindow.getFocusedWindow();
        // win.setSize(1200, 800, true);
        // win.maximize();
        // win.setPosition(0, 0, true);

        // success: #8BC34A 139,195,74
        // info: #00BCD4 0,188,212
        // gray: #EDF0F1 237,240,241

        _.map(overtop_50, function(prod) {
            var id = prod.id;
            var productProps = nationwide.getProductById(id);
            var zhishu = nationwide.zscxj(id);

            prod.offset = (productProps.market_productPrice - zhishu) / zhishu;
            getImgs(id).then(function(img) {
                prod.img = img[id];
            });
            return prod;
        });
        $scope.overtop_50 = overtop_50;
        $scope.warningProducts50 = _.slice(overtop_50, 0, 5);


        $scope.pie1 = {};
        $scope.pie1.events = {
            click: function(event, chart) {

                $scope.pie2.title = event.name;

                var groupName = event.data.alias;
                var data = getPie2Data(groupName);

                $scope.pie2.options.series[0].data = data[0];
                $scope.pie2.options.legend.data = data[1];

                // chart.setOption($scope.pie2.options);
                var op = $scope.pie2.options;
                $scope.pie2.options = Object.assign({}, op);
                $root.$apply();
            }
        };
        $scope.pie1.options = {
            color: [
                '#385b8c',
                '#3a75c7',
                '#427dd8',
                '#74b0ff',
                '#98ba1c',

                '#ff6347',
                '#ff7f50',
                '#C2BE38',
                '#61B360',
                "#00BCB0",
                '#32cd32'
            ],

            selectedMode: 'single',
            title : {
                text: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: '{b} : <br/>共{c}款产品 ({d}%) <br/>',
                // position:['0', '0']
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:[
                    '高于指数价格50%',
                    '高于指数价格20%至50%',
                    '高于指数价格10%至20%',
                    '高于指数价格0%至10%',
                    '低于指数价格'
                ]
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "刷新"},
                    saveAsImage : {show: true, title: "保存为图片"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'',
                    type:'pie',
                    selectedMode: 'single',
                    selectedOffset: 0,
                    radius : [0, 140],
                    center: ['50%', '50%'],
                    data:[
                        {value:overtop_50.length,    name:'高于指数价格50%', alias: 'overtop_50'},
                        {value:overtop_20_50.length, name:'高于指数价格20%至50%', alias: 'overtop_20_50'},
                        {value:overtop_10_20.length, name:'高于指数价格10%至20%', alias: 'overtop_10_20'},
                        {value:overtop_0_10.length, name:'高于指数价格0%至10%', alias: 'overtop_0_10'},
                        {value:overtop_less.length, name:'低于指数价格', alias: 'overtop_less'}
                    ]
                }
            ]
        };

        $scope.pie2 = {defaultData: getPie2Data('overtop_50'), title: '高于指数价格50%'};
        $scope.pie2.events = {
            click: function(event, chart) {
                var data = event.data;
                var grp = _.groupBy(data, 'category');

                // debugger;

                $scope.showTableDialog(event.data);
            }
        };
        $scope.pie2.options = {
            title : {
                text: '',
                x:'center'
            },
            // tooltip : {
            //     trigger: 'item',
            //     formatter: '{b} : <br/>共{c}款产品 ({d}%) <br/>',
            //     // position:['100', '100']
            // },
            legend: {
                // orient : 'vertical',
                x : 'center',
                y : 'bottom',
                data: $scope.pie2.defaultData[1]
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "刷新"},
                    saveAsImage : {show: true, title: "保存为图片"}
                }
            },
            calculable : true,
            series : [
                {
                    name: 'Traffic source',
                    type:'pie',
                    radius : [50, 90],
                    center: ['50%', '40%'],
                    selectedMode: 'single',
                    selectedOffset: 0,
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : false,
                                position : 'center',
                                textStyle : {
                                    fontSize : '30',
                                    fontWeight : 'bold'
                                }
                            }
                        }
                    },
                    data: $scope.pie2.defaultData[0]
                }
            ]
        };


        // Traffic chart
        $scope.combo = {};
        $scope.combo.options = {
            legend: {
                show: true,
                x: 'right',
                y: 'top',
                data: ['WOM', 'Viral', 'Paid']
            },
            grid: {
                x: 40,
                y: 60,
                x2: 40,
                y2: 30,
                borderWidth: 0
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            },
            xAxis: [
                {
                    type : 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#607685'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#f3f3f3'
                        }
                    },
                    data : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
                }
            ],
            yAxis: [
                {
                    type : 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#607685'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#f3f3f3'
                        }
                    }
                }
            ],
            series: [
                {
                    name:'WOM',
                    type:'bar',
                    clickable: false,
                    itemStyle: {
                        normal: {
                            color: $scope.color.gray
                        },
                        emphasis: {
                            color: 'rgba(237,240,241,.7)'
                        }
                    },
                    barCategoryGap: '50%',
                    data:[75,62,45,60,73,50,31,56,70,63,49,72,76,67,46,51,69,59,85,67,56],
                    legendHoverLink: false,
                    z: 2
                },
                {
                    name:'Viral',
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            color: $scope.color.success,
                            areaStyle: {
                                color: 'rgba(139,195,74,.7)',
                                type: 'default'
                            }
                        }
                    },
                    data:[0,0,0,5,20,15,30,28,25,40,60,40,43,32,36,23,12,15,2,0,0],
                    symbol: 'none',
                    legendHoverLink: false,
                    z: 3
                },
                {
                    name:'Paid',
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            color: $scope.color.info,
                            areaStyle: {
                                color: 'rgba(0,188,212,.7)',
                                type: 'default'
                            }
                        }
                    },
                    data:[0,0,0,0,1,6,15,8,16,9,25,12,50,20,25,12,2,1,0,0,0],
                    symbol: 'none',
                    legendHoverLink: false,
                    z: 4
                }
            ]
        };


        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $mdDialog.hide();
        });

        $scope.showTableDialog = function(ev) {

            $mdDialog.show({
              templateUrl: 'app/dashboard/dialog/dialog.template.html',
              parent: angular.element(document.body),
              // targetEvent: ev,
              clickOutsideToClose:true,
              controller: ['$scope', function ($dialogScope) {

                    $dialogScope.title =  $scope.pie2.title + '的' + ev.category;

                    $dialogScope.hide = function() {
                      $mdDialog.hide();
                    };

                    $dialogScope.cancel = function() {
                      $mdDialog.cancel();
                    };

                    $dialogScope.answer = function(answer) {
                      $mdDialog.hide(answer);
                    };

                    /**
                     *  表格
                     */
                    $dialogScope.selected = [];
                    $dialogScope.limitOptions = [5, 10, 15];
                    $dialogScope.pgLabel = {
                        "of": '共',
                        "page": '页码:',
                        "rowsPerPage": '每页显示:'
                    }

                    $dialogScope.options = {
                        rowSelection: true,
                        multiSelect: true,
                        autoSelect: true,
                        decapitate: false,
                        largeEditDialog: false,
                        boundaryLinks: false,
                        limitSelect: true,
                        pageSelect: true
                    };

                    $dialogScope.query = {
                        order: 'name',
                        limit: 5,
                        page: 1
                    };


                    ev.childred.map(function(dessert) {

                        var price = dessert['gov_'+LOCAL_GOV+'_productPrice'];
                        var zscxj = nationwide.zscxj(dessert);

                        dessert.localPrice = price;
                        dessert.price2 = zscxj;
                        dessert.chajia = Math.ceil((price-zscxj)/zscxj * 100);
                        return dessert;
                    });

                    $dialogScope.desserts = {
                        "count": 9,
                        "data": ev.childred
                    };


                    $dialogScope.toggleLimitOptions = function () {
                        $dialogScope.limitOptions = $dialogScope.limitOptions ? undefined : [5, 10, 15];
                    };

                    $dialogScope.getTypes = function () {
                        return ['Candy', 'Ice cream', 'Other', 'Pastry'];
                    };

                    $dialogScope.loadStuff = function () {
                        $dialogScope.promise = $timeout(function () {
                            // loading
                        }, 2000);
                    }

                    $dialogScope.logItem = function (item) {
                        console.log(item.name, 'was selected');
                    };

                    $dialogScope.logOrder = function (order) {
                        console.log('order: ', order);
                    };

                    $dialogScope.logPagination = function (page, limit) {
                        console.log('page: ', page);
                        console.log('limit: ', limit);
                    }
                    // end 表格
                }],
            });
        };





        $scope.showWarningProducts = function(ev) {
            $mdDialog.show({
              controller: ['$scope', warningProductsController],
              templateUrl: 'app/dashboard/dialog/warning.template.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
        };

        function warningProductsController($scope) {
            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
              $mdDialog.hide(answer);
            };

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



            overtop_50.map(function(dessert) {
                var price = dessert['gov_'+LOCAL_GOV+'_productPrice'];
                var zscxj = nationwide.zscxj(dessert);

                dessert.localPrice = price;
                dessert.price2 = zscxj;
                dessert.chajia = (dessert.price/dessert.price2*100)['toFixed'](2);
                return dessert;
            });

            $scope.desserts = {
                "count": 9,
                "data": overtop_50
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
    }

})();
