var chart = angular.module('Chart', ['BarChart','LineChart','PieChart','TextChart','PicChart','CloudChart','DonutChart','ForceChart', 'GaugeChart'])
    .service('chartServiceObject', ['$injector', function($injector){
        var charttype = ['barchart', 'linechart', 'piechart', 'textchart', 'picchart', 'cloudchart','donutchart','forcechart', 'gaugechart'];

        var chartServiceObject = {};
        for (var i = 0; i < charttype.length; i++){
            chartServiceObject[charttype[i]] = $injector.get(charttype[i]);
        }
        return chartServiceObject;
    }])
.service('chart', ['chartServiceObject', '$rootScope', function (chartServiceObject, $rootScope) {
	var appcharts = [];

    //鼠标点击legend
	function legendclick(id){
		for (var i = 0; i < appcharts.length; i++){
			appcharts[i].toggle(id);
		}
	}

    //鼠标hover
	function legendonmouseover(id){
		for (var i = 0; i < appcharts.length; i++){
			appcharts[i].focus(id);
		}
	}

    //鼠标mouseout
	function legendonmouseout(){
		for (var i = 0; i < appcharts.length; i++){
			appcharts[i].focus();
		}
	}

    //zoom响应
    function reclacdomain(d, e){
        var start = Math.ceil(d[0]);
        var end = Math.floor(d[1]);
        for (var i = 0; i < appcharts.length; i++){
            //只更改其他图表
            if(e.element.id != appcharts[i].element.id){
                if (appcharts[i].canzoom){
                    appcharts[i].zoom(d);
                }else{
                    //计算根据domain重新计算后的值
                    //var resdata = _calcNewDataByDomain(e.data(), start, end);
                    //appcharts[i].load({
                    //    columns: resdata
                    //});
                }
            }
        }
    }

    //哪些图表可以进行自动的zoom
    function _canZoom(chart){
        var canZoomType = ['line', 'bar'];
        for (var i = 0; i < canZoomType.length; i++){
            if (chart.type == canZoomType[i]) return true;
        }
        return false;
    }

    //按照图表根据domain计算区域
    function _calcNewDataByDomain(data, start, end){
        var res = [];
        for (var i = 0; i<data.length; i++) {
            var id = data[i].id;
            var values = data[i].values;
            var v_start = 0, v_end = values.length-1;
            while (values[v_start].x < start) v_start++;
            while (values[v_end].x > end) v_end--;
            var tmp = [id];
            for (var j = v_start; j <= v_end; j++){
                tmp.push(values[j].value);
            }
            res.push(tmp);
        }
        return res;
    }

	//图表变色
	$rootScope.$on("chartColorChange", function(e, colors){
		for (var i = 0; i < appcharts.length; i++){
			var datas = appcharts[i].data();
			var data_color = {};
			for (var j = 0; j < datas.length; j++){
				var colorindex = j % colors.length;
				data_color[datas[j]['id']] = colors[colorindex];
			}
			appcharts[i].data.colors(data_color);
		}
	});

	return {
		defaultconfig:{
            data: {
                x: 'x',
                type: 'bar',
				columns: []
			},
			color: {

			},
			padding: {
				top: 10,
				right: 10,
				bottom: 10
			},
			zoom: {
		        enabled: true,
				onzoomend: function (domain) {
					reclacdomain(domain, this);
				}
		    },
		    legend: {
		    	show: true,
		    	item: {
		    		onclick: legendclick,
		    		onmouseover: legendonmouseover,
		    		onmouseout: legendonmouseout
		    	}
		    },
		    axis: {
		    	x: {
		    		show: "show",
                    type: 'category',
		    		label: {
		    			//text: '',
		    			//position: 'outer-center'
		    		}
		    	},
		    	y: {
		    		show: "show",
		    		label: {
		    			//text: '',
		    			//position: 'outer-middle'
		    		}
		    	}
		    }
		},
        grid_config: {
            size_x: 3,
            size_y: 3
        },
		init: function(type, bindto, data){
			var config = angular.copy(this.defaultconfig);
            var grid_config = angular.copy(this.grid_config);
            var chartservice = chartServiceObject[type+'chart'];
			switch(type) {
				case 'bar':
				case 'line':
				case 'pie':
                case 'donut':
                case 'gauge':
                    config = angular.extend(config, chartservice.initconfig);
                    break;
				case 'text':
				case 'pic':
                case 'cloud':
                case 'force':
                    config = angular.copy(chartservice.initconfig);
                    break;
				default:
					break;
			}
            grid_config = angular.extend(grid_config, chartservice.initGridConfig);

			config.bindto = '#'+bindto;
            //如果是基本图表的话
			if (!config.toolchart){
				config.data_config = data;
                if (data){
				    config.data.columns = data.json;
                }else{
                    config.data.columns = chartservice.defaultData;
                }
			}

			return {
                chart_config: config,
                grid_config: grid_config
            };
		},
		draw: function(config){
			var tmpchart = null;
			if (!config.toolchart){
                //如果是基本图表
				config.size = {
					width: $(config.bindto).parent().width(),
					height: $(config.bindto).parent().height()
				}
				tmpchart = jk.drawChart(config);
                tmpchart.type = config.data.type;
                tmpchart.canzoom = _canZoom(tmpchart);
				appcharts.push(tmpchart);
			}else{
                //如果不是基本图表
				if (config.type == 'text' || config.type == 'pic' || config.type == 'cloud' || config.type == 'force'){
                    tmpchart = chartServiceObject[config.type+'chart'].draw(config);
				}
			}
			return tmpchart;
		}
	}
}])
.directive('ngChartConfig', ['chartServiceObject', '$compile', '$injector', function (chartServiceObject, $compile, $injector) {
	function choose_chart_config(type){
        return chartServiceObject[type+'chart'].config_panel_html;
	}
	//匹配Unload数据
	function _findunload(oldcolumn, newcolumn){
		var ks = {};
        if (oldcolumn){
            for (var i = 0; i < oldcolumn.length; i++){
                ks[oldcolumn[i][0]] = true;
            }
        }
		for (var i = 0; i < newcolumn.length; i++){
			if (ks[newcolumn[i][0]]){
				delete ks[newcolumn[i][0]];
			}
		}
		var res = [];
		for (var i in ks){
			if (ks[i]) res.push(i);
		}
		return res;
	}
	return {
		restrict: 'A',
		scope: {
			chart: '='
		},
		link: function ($scope, iElement, iAttrs) {
			var curchart = $scope.chart;

			//检视数据
		    $scope.importData = function(){
		    	var data_config = curchart.chart_config.data_config || {};
		        $scope.$emit('Data-OpenModal', {
		            data: data_config,
		            callback: function(obj){
		            	//更新数据存储
		            	curchart.chart_config.data_config = obj;

		                //重绘数据表
		                if (!curchart.chart.redrawchart){
                            curchart.chart_config.data.columns = obj.json;
                            curchart.chart.load({
                                columns: obj.json,
                                unload: _findunload(data_config.json, obj.json)
                            });
		                    //数据颜色
		                    curchart.chart_config.data.colors = curchart.chart.data.colors();
                        }else{
                            if (curchart.chart.redrawchart){
                                curchart.chart.redrawchart(obj);
                            }
                        }
                    }
		        });
		    }

			//获取配置Html模板
			var confightml = choose_chart_config(curchart.type);
			$config = $compile(confightml)($scope);
			angular.element(iElement).empty().append($config);

			if (curchart.chart_config.toolchart) return;
			//配置颜色
			//获取data集合颜色
			curchart.chart_config.data.colors = curchart.chart.data.colors();
			//设置颜色变化监听函数
			$scope.$watch('chart.chart_config.data.colors', function(newval, oldval){
				if (newval && !angular.equals(oldval, newval)){
					curchart.chart.data.colors(newval);
				}
			}, true);

			//设置XY轴label监听函数
			$scope.$watch('chart.chart_config.axis', function(newval, oldval){
				if (newval && !angular.equals(oldval, newval)){
					curchart.chart.axis.labels({
						x: newval.x.label.text,
						y: newval.y.label.text
					});
				}
			}, true);

			//显示图例监听函数
			$scope.$watch('chart.chart_config.legend.show', function(newval, oldval){
				if (newval != oldval){
					if (newval == true){
						curchart.chart.legend.show();
					}else{
						curchart.chart.legend.hide();
					}
				}
			}, true);

            //更新圆环title
            $scope.$watch('chart.chart_config.donut.title', function(newval, oldval){
                if (newval && newval != oldval){
                    curchart.chart.internal.main.select('.c3-chart-arcs-title').text(newval);
                }
            });

		}
	};
}])
.directive('ngColorPick', [function () {
	return {
		restrict: 'A',
		scope: {
			color: '='
		},
		link: function ($scope, iElement, iAttrs) {
			$(iElement).colpick({
				layout: 'hex',
				submit: 0,
				color: $scope.color,
				onChange: function(hsb, hex){
					$scope.color = '#' + hex;
					$scope.$apply();
				}
			});
		}
	};
}]);


var Bar = angular.module('BarChart', [])
.service('barchart', [function(){
	var config_html = $("#barchart_config").html();
	return {
		initconfig: {
			data: {
				type: 'bar',
                x: 'x'
			},
			name: '柱状图'
		},
        defaultData: [],
		config_panel_html: config_html,
		draw: function(config){
			return jk.drawChart(config);
		}
	}
}]);

var Line = angular.module('LineChart', [])
.service('linechart', [function(){
	var config_html = $("#linechart_config").html();
	return {
		initconfig: {
			data: {
				type: 'line',
                x: 'x'
			},
			name: '折线图'
		},
        defaultData: [],
        config_panel_html: config_html,
		draw: function(config){
			return jk.drawChart(config);
		}
	}
}]);

var Pie = angular.module('PieChart', [])
.service('piechart', [function(){
	var config_html = $("#piechart_config").html();
	return {
		initconfig: {
			data: {
				type: 'pie',
			},
			zoom: {
		        enabled: false
		    },
		    name: '饼图'
		},
        defaultData: [],
        initGridConfig: {
            size_x: 2,
            size_y: 3
        },
		config_panel_html: config_html,
		draw: function(config){
			return jk.drawChart(config);
		}
	}
}]);

var Donut = angular.module('DonutChart', [])
.service('donutchart', [function(){
    var config_html = $("#donutchart_config").html();
    return {
        initconfig: {
            data: {
                type: 'donut',
            },
            zoom: {
                enabled: false
            },
            donut: {
                title: "新闻情感"
            },
            name: '圆环图'
        },
        defaultData: [],
        initGridConfig: {
            size_x: 2,
            size_y: 3
        },
        config_panel_html: config_html,
        draw: function(config){
            return jk.drawChart(config);
        }
    }
}]);


var Gauge = angular.module('GaugeChart', [])
.service('gaugechart', [function() {
    var config_html = $("#gaugechart_config").html();
    return {
        initconfig: {
            data: {
                type: 'gauge'
            },
            zoom: {
                enabled: false
            },
            gauge: {
            },
            name: '度量图'
        },
        defaultData: [],
        initGridConfig: {
            size_x: 2,
            size_y: 3
        },
        config_panel_html: config_html,
        draw: function(config){
            return jk.drawChart(config);
        }
    }
}]);

/**
 * Text类型工具组件
 * @type {angular.IModule}
 */
var Text = angular.module('TextChart', [])
.service('textchart', ['TEXT_MARKDOWN', function(TEXT_MARKDOWN){
	var config_html = $("#textchart_config").html();
	var defaulthtml = '请配置文本块中的文字，支持markdown形式';

	return {
		initconfig: {
			type: 'text',
			name: '富文本',
			toolchart: true,
			html: '# EventTeller - 互联网话题事件追踪\n### Created by DBIIR\n\n话题追踪\历史回顾\精确定位',
			text: '# EventTeller - 互联网话题事件追踪\n### Created by DBIIR\n\n话题追踪\历史回顾\精确定位'
		},
        initGridConfig: {
            size_x: 6,
            size_y: 3
        },
		config_panel_html: config_html,
		draw: function(config){
			$(config.bindto).addClass('markdown').html(config.html);
			return null;
		}
	}
}])
.value('TEXT_MARKDOWN', function(){
	if (!window.TEXT_MARKDOWN){
		window.TEXT_MARKDOWN = $("#textConfigModal .textArea").markdown({
			hiddenButtons: 'cmdUrl,cmdImage'
		});
	}
	return window.TEXT_MARKDOWN;
})
.directive('ngTextConfigModal', ['TEXT_MARKDOWN', function (TEXT_MARKDOWN) {
	return {
		restrict: 'A',
		scope: {
			config: '='
		},
		link: function ($scope, iElement) {
			var t = TEXT_MARKDOWN().data('markdown');
			t.setContent($scope.config.text);
			$(iElement).click(function(){
				$("#textConfigModal .submitText").unbind('click').bind('click', function(){
                    var htmlval = t.parseContent();
                    $scope.config.text = t.getContent();
					$scope.config.html = htmlval;
					$($scope.config.bindto).html(htmlval);
					$("#textConfigModal").modal('hide');
					$scope.$apply();
				});
			});
		}
	};
}]);

var Pic = angular.module('PicChart', [])
.service('picchart', [function(){
	var config_html = $("#picchart_config").html();
	return {
		initconfig: {
			type: 'pic',
			name: '图片',
			toolchart: true,
			imgurl: null
		},
		config_panel_html: config_html,
		draw: function(config){
			if (config.imgurl != null){
				$(config.bindto).html(this.panelhtml(config.imgurl));
			}else{
				$(config.bindto).html("请绑定图片地址");
			}
		},
		panelhtml: function(imgurl){
			return "<img style='width:100%' src='"+imgurl+"'/>";
		}
	}
}])
.directive('ngPicConfigModal', ['picchart', function (picchart) {
	return {
		restrict: 'A',
		scope: {
			config: '='
		},
		link: function ($scope, iElement, iAttrs) {
			$(iElement).click(function(){
				var input = $("#picConfigModal .imgurl");
				input.val($scope.config.imgurl);
				$("#picConfigModal .submitText").unbind('click').bind('click', function(){
					$scope.config.imgurl = input.val();
					$($scope.config.bindto).html(picchart.panelhtml($scope.config.imgurl));
					$("#picConfigModal").modal('hide');
					$scope.$apply();
				});
			});
		}
	};
}]);

var Cloud = angular.module('CloudChart', [])
.service('cloudchart', [function(){
    var config_html = $("#cloudchart_config").html();

    return {
        initconfig: {
            type: 'cloud',
            name: '词云图',
            toolchart: true,
            setting: {
                "size" : {
                    "grid" : 16,
                    "factor" : 0,
                    "normalize" : true
                },
                "options" : {
                    "color" : "random-dark",
                    "printMultiplier" : 3,
                    "sort": "highest"
                },
                "font" : "Futura, Helvetica, sans-serif",
                "shape" : "circle"
            },
            data_config: {
                string: '{"通话":"007","电话":"004","进行":"004","航班":"018","残骸":"002","物体":"004","机组":"002","工作":"004","对话":"002","握手":"002","图像":"003","印度洋":"003","区域":"003","回应":"003","马航":"006","否认":"006","进展":"002","最新":"002","首次":"004","晚安":"002","军方":"008","机长":"004","搜救":"007","调查":"015","代表":"003","一个":"002","人员":"004","黑匣子":"006","确认":"002","团队":"003","联系":"007","消息":"003","中新网":"002","是否":"004","时间":"002","部分":"002","家属":"022","雷达":"008","得到":"002","马方":"136","飞机":"011","法国":"004","收获":"002","恢复":"004","继续":"006","有关":"002","期间":"002","努力":"002","客机":"029","敏感":"003","公布":"009","模拟器":"005","隐瞒":"005","线索":"002","相关":"004","高级":"003","最后":"006","飞行员":"005","沟通":"003","保持":"002","中国":"007","正常":"002","不能":"003","370":"016","没有":"003","飞行":"011","记录":"003","机上":"003","承认":"006","质疑":"002","透露":"005","盲区":"002","搜索":"006","失联":"050","可能":"012","122个":"004","卫星":"020","发布":"005","会议":"002","25日":"002","通讯":"002","特殊":"002","深海":"003","数据":"011","重心":"003","民航局":"002","信息":"014","搜寻":"007","考虑":"004","坠毁":"002","小时":"005","确定":"002","表示":"002","要求":"004","乘客":"011","发布会":"004","细节":"005","发现":"011","安排":"002","宣布":"002"}',
                json: {}
            }
        },
        config_panel_html: config_html,
        draw: function(config){
            var parent = $(config.bindto).parent();
            var cc =  $(config.bindto).css({
                width: parent.width(),
                height: parent.height(),
                padding: 5
            }).html('请在左侧配置区域配置数据');
            cc.redrawchart = function(data){
                $(this).empty().css({
                    width: parent.width(),
                    height: parent.height(),
                    padding: 5
                });
                for (var i in data.json){
                    $(this).append('<span data-weight='+data.json[i]+'>'+i+'</span>');
                }
                $(this).awesomeCloud(config.setting);
            }
            return cc;
        }
    }
}]);


var Force = angular.module('ForceChart', [])
.service('forcechart', [function(){
    var config_html = $("#forcechart_config").html();

    return {
        initconfig: {
            type: 'force',
            name: '力导向布局图',
            toolchart: true,
            setting: {
            },
            data_config: {
                string: '[{"id":"1","children":[{id:"11"},{id:"12"},{id:"13"},{id:"14"},{id:"15"}]},{"id":"2","children":[{id:"21"},{id:"22"},{id:"23"},{id:"24"},{id:"25"},{id:"26"},{id:"27"},{id:"28"},{id:"29"},{id:"20"}]},{"id":"3","children":[{id:"31"},{id:"32"},{id:"33"}]},{"id":"4","children":[{id:"41"},{id:"42"},{id:"43"},{id:"44"},{id:"45"}]},{"id":"5","children":[{id:"51"},{id:"52"},{id:"53"},{id:"54"}]}]',
                json: {}
            }
        },
        initGridConfig: {
            size_x: 6,
            size_y: 5
        },
        config_panel_html: config_html,
        draw: function(config){
            var parent = $(config.bindto).parent();
            var cc =  $(config.bindto).css({
                width: parent.width(),
                height: parent.height(),
                padding: 5
            });
            cc.crcanvas = jk.drawChart({
                type: 'CrCanvas',
                option: {
                    id: config.bindto
                }
            });
            cc.crcanvas.init();
            cc.redrawchart = function(data){
                cc.crcanvas.empty();
                $.each(data.json, function(){
                    var that = this;
                    cc.crcanvas.addNode({
                        type: 'big',
                        id: that.id,
                        immortal: true
                    });
                    $.each(this.children, function(){
                        var cldthat = this;
                        cc.crcanvas.addNode({
                            type: 'small',
                            id: cldthat.id,
                            pid: that.id,
                            radius: 10,
                            immortal: true
                        });
                    });
                });
            }
            return cc;
        }
    }
}]);