(function () {
    'use strict';

    angular.module('app')
        .controller('DashboardCtrl', ['$mdDialog', '$rootScope', '$scope', DashboardCtrl])

    function DashboardCtrl($mdDialog, $root, $scope) {
        // success: #8BC34A 139,195,74
        // info: #00BCD4 0,188,212
        // gray: #EDF0F1 237,240,241

        var data2 = [
            [
                {value:335, name:'扫描仪'},
                {value:310, name:'数码相机'},
                {value:234, name:'多功能一体机'},
                {value:135, name:'空调'}
            ], [
                {value:64, name:'打印机'},
                {value:100, name:'数码相机'},
                {value:98, name:'笔记本'},
                {value:10, name:'空调'}
            ], [
                {value:120, name:'高速扫描仪'},
                {value:150, name:'A4黑白激光打印机'},
                {value:112, name:'笔记本'},
                {value:163, name:'平板扫描仪'}
            ], [
                {value:335, name:'投影仪'},
                {value:310, name:'打印设备'},
                {value:234, name:'复印机'},
                {value:135, name:'台式计算机'}
            ], [
                {value:435, name:'打印机'},
                {value:510, name:'数码相机'},
                {value:334, name:'笔记本'},
                {value:395, name:'空调'}
            ]
        ];

        //
        const fs = nodeRequire('fs');
        const path = nodeRequire('path');
        const dataFile = path.join(__dirname, '/data/sc.xlsx');
        let xlsx2json = nodeRequire('xlsx2json');
        xlsx2json(dataFile).then(jsonArray => {
            // debugger;
        });

        $scope.pie1 = {};
        $scope.pie1.events = {
            click: function(event, chart) {
                console.log(event);

                if (event.seriesIndex === 0) {
                    // debugger;
                    $scope.pie2Title = event.name;

                    var legendData = [];
                    var dataIndex = event.dataIndex;
                    var data = data2[dataIndex] || data2[0];

                    data.forEach(function(itm) {
                        legendData.push(itm.name);
                    });

                    $scope.pie1.options.legend.data = legendData;
                    $scope.pie1.options.series[1].data = data;

                    // chart.setOption($scope.pie2.options);
                    var op = $scope.pie1.options;
                    $scope.pie1.options = Object.assign({}, op);
                    $root.$apply();
                    // $scope.pie2.options = op;
                } else if (event.seriesIndex === 1) {
                    $scope.showTableDialog();
                }
            }
        };
        $scope.pie1.options = {
            title : {
                text: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: '{b} : <br/>共{c}款产品 ({d}%) <br/>',
                position:['100', '100']
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
                    radius : [0, 70],
                    center: ['50%', '50%'],
                    data:[
                        {value:335, name:'高于指数价格50%'},
                        {value:310, name:'高于指数价格20%至50%'},
                        {value:234, name:'高于指数价格10%至20%'},
                        {value:135, name:'高于指数价格0%至10%'},
                        {value:1548, name:'低于指数价格'}
                    ]
                },
                {
                    name:'Traffic source',
                    type:'pie',
                    radius : [110, 140],
                    center: ['50%', '50%'],
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
                    data: data2[0]
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


        //
        $scope.smline1 = {};
        $scope.smline2 = {};
        $scope.smline3 = {};
        $scope.smline4 = {};
        $scope.smline1.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            },
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    itemStyle: {
                        normal: {
                            color: $scope.color.info
                        }
                    }
                }
            ]
        };
        $scope.smline2.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            },
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 10, 14, 12, 13, 11, 12],
                    itemStyle: {
                        normal: {
                            color: $scope.color.success
                        }
                    }
                }
            ]
        };
        $scope.smline3.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            },
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 10, 15, 13, 12, 13, 10],
                    itemStyle: {
                        normal: {
                            color: $scope.color.danger
                        }
                    }
                }
            ]
        };
        $scope.smline4.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            },
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 12, 8, 10, 15, 12, 10],
                    itemStyle: {
                        normal: {
                            color: $scope.color.warning
                        }
                    }
                }
            ]
        };


        // Engagment pie charts
        var labelTop = {
            normal : {
                color: $scope.color.primary,
                label : {
                    show : true,
                    position : 'center',
                    formatter : '{b}',
                    textStyle: {
                        color: '#999',
                        baseline : 'top',
                        fontSize: 12
                    }
                },
                labelLine : {
                    show : false
                }
            }
        };
        var labelFromatter = {
            normal : {
                label : {
                    formatter : function (params){
                        return 100 - params.value + '%'
                    },
                    textStyle: {
                        color: $scope.color.text,
                        baseline : 'bottom',
                        fontSize: 20
                    }
                }
            },
        }
        var labelBottom = {
            normal : {
                color: '#f1f1f1',
                label : {
                    show : true,
                    position : 'center'
                },
                labelLine : {
                    show : false
                }
            }
        };
        var radius = [55, 60];
        $scope.pie = {};
        $scope.pie.options = {
            series : [
                {
                    type : 'pie',
                    center : ['12.5%', '50%'],
                    radius : radius,
                    itemStyle : labelFromatter,
                    data : [
                        {name:'Bounce', value:36, itemStyle : labelTop},
                        {name:'other', value:64, itemStyle : labelBottom}
                    ]
                },{
                    type : 'pie',
                    center : ['37.5%', '50%'],
                    radius : radius,
                    itemStyle : labelFromatter,
                    data : [
                        {name:'Activation', value:45, itemStyle : labelTop},
                        {name:'other', value:55, itemStyle : labelBottom}
                    ]
                },{
                    type : 'pie',
                    center : ['62.5%', '50%'],
                    radius : radius,
                    itemStyle : labelFromatter,
                    data : [
                        {name:'Retention', value:25, itemStyle : labelTop},
                        {name:'other', value:75, itemStyle : labelBottom}
                    ]
                },{
                    type : 'pie',
                    center : ['87.5%', '50%'],
                    radius : radius,
                    itemStyle : labelFromatter,
                    data : [
                        {name:'Referral', value:75, itemStyle : labelTop},
                        {name:'other', value:25, itemStyle : labelBottom}
                    ]
                }
            ]
        };



        $scope.showTableDialog = function(ev) {
            $mdDialog.show({
              controller: ['$scope', DialogController],
              templateUrl: 'app/dashboard/dialog/dialog.template.html',
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

          function DialogController($scope) {
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

                var tableData = [
                    {"name": "佳能 CANON IP7280 喷墨打印机", "price": 879 , "price2": 999},
                    {"name": "联想 LENOVO M7450F（双面器/250页/黑白激光）多功能一体机", "price": 1546 , "price2": 1819},
                    {"name": "佳能 CANON D1380（双面器/双面输稿器/250页/黑白激光）多功能一体机", "price": 4591 , "price2": 5268},
                    {"name": "联想（LENOVO）M7675DXF 黑白激光一体机(打印 复印 扫描 传真)", "price": 1797 , "price2": 3199},
                    {"name": "惠普（HP）LASERJETM226DW激光多功能一体机（打印、复印、扫描、传真）", "price": 2369 , "price2": 2599},
                    {"name": "惠普 HP M128FP（双面器/150页/黑白激光）多功能一体机", "price": 1741 , "price2": 2049},
                    {"name": "佳能 CANON CANOSCAN 9000F MARKII 扫描仪", "price": 2604 , "price2": 2085},
                    {"name": "爱普生 EPSON V39 高效型 照片与文档扫描仪", "price": 586 , "price2": 599},
                    {"name": "索尼 SONY VPL-CH378 投影仪", "price": 19999 , "price2": 17999},
                    {"name": "松下 PANASONIC PT-X330C（3LCD/3300流明/1024×768DPI）投影机", "price": 3241 , "price2": 3999},
                    {"name": "爱普生 EPSON EB-C301MN（3LCD/3000流明/1280×800DPI）投影机", "price": 5269 , "price2": 5999},
                    {"name": "尼康 NIKON D610（单机）数码相机", "price": 7854 , "price2": 7599},
                    {"name": "尼康（NIKON） D810 单反机身", "price": 16071 , "price2": 15799},
                    {"name": "佳能（CANON）EOS 760D 单反套机 （EF-S 17-85mm f/4-5.6 IS USM 镜头）", "price": 6299 , "price2": 6000},
                    {"name": "佳能（CANON） EOS 5D MARK III 单反机身", "price": 16112 , "price2": 16499},
                    {"name": "索尼 SONY DSC-HX90 数码便携照相机", "price": 2485 , "price2": 2599},
                    {"name": "ILCE-6000", "price": 3689 , "price2": 3599},
                    {"name": "尼康 NIKON COOLPIX P340 数码相机", "price": 2280 , "price2": 3112},
                    {"name": "尼康 NIKON D7000（18-300MM）数码相机", "price": 6730 , "price2": 6500},
                    {"name": "索尼（SONY）ILCE-7S 微单相机 黑色 (机身A7S/α7S)", "price": 13088 , "price2": 11599},
                    {"name": "佳能（CANON） EOS 70D 单反机身", "price": 5437 , "price2": 5499},
                    {"name": "索尼 SONY DSC-RX100M3 数码便携照相机", "price": 4345 , "price2": 4599},
                    {"name": "柯尼卡美能达 KONICA MINOLTA BIZHUB 235（双面器 网络打印卡 500页）复印机", "price": 4676 , "price2": 12299}
                ];

                tableData.map(function(dessert) {
                    dessert.chajia = (dessert.price/dessert.price2*100)['toFixed'](1);
                    return dessert;
                });

                $scope.desserts = {
                    "count": 9,
                    "data": tableData
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
