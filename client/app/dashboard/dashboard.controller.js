(function () {
    'use strict';

    angular.module('app')
        .controller('DashboardCtrl', ['$rootScope', '$scope', DashboardCtrl])

    function DashboardCtrl($root, $scope) {
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

        $scope.pie1 = {};
        $scope.pie2 = {};

        $scope.pie1.events = {
            click: function(event, chart) {
                // debugger;
                $scope.pie2Title = event.name;

                var legendData = [];
                var dataIndex = event.dataIndex;
                var data = data2[dataIndex] || data2[0];

                data.forEach(function(itm) {
                    legendData.push(itm.name);
                });

                $scope.pie2.options.legend.data = legendData;
                $scope.pie2.options.series[0].data = data;

                // chart.setOption($scope.pie2.options);
                var op = $scope.pie2.options;
                $scope.pie2.options = Object.assign({}, op);
                $root.$apply();
                // $scope.pie2.options = op;
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
                data:['高于指数价格50%','高于指数价格20%至50%','高于指数价格10%至20%','高于指数价格0%至10%','低于指数价格']
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
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'高于指数价格50%'},
                        {value:310, name:'高于指数价格20%至50%'},
                        {value:234, name:'高于指数价格10%至20%'},
                        {value:135, name:'高于指数价格0%至10%'},
                        {value:1548, name:'低于指数价格'}
                    ]
                }
            ]
        };

        $scope.pie2Title = $scope.pie1.options.legend.data[0];
        $scope.pie2.options = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:[ '打印机','数码相机','笔记本','空调']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'Traffic source',
                    type:'pie',
                    radius : ['50%', '70%'],
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
                                show : true,
                                position : 'center',
                                textStyle : {
                                    fontSize : '30',
                                    fontWeight : 'bold'
                                }
                            }
                        }
                    },
                    data:[
                        {value:435, name:'打印机'},
                        {value:510, name:'数码相机'},
                        {value:334, name:'笔记本'},
                        {value:395, name:'空调'}
                    ]
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
    }


})();
