var chart = angular.module('Chart', ['BarChart','LineChart','PieChart','TextChart','PicChart','CloudChart'])
.service('chart', ['barchart', 'linechart', 'piechart', 'textchart', 'picchart', 'cloudchart', '$rootScope', function (barchart, linechart, piechart, textchart, picchart, cloudchart, $rootScope) {
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
                    var resdata = _calcNewDataByDomain(e.data(), start, end);
                    appcharts[i].load({
                        columns: resdata
                    });
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
		init: function(type, bindto, data){
			var config = angular.copy(this.defaultconfig);
			switch(type) {
				case 'bar':
					config = angular.extend(config, barchart.initconfig);
					break;
				case 'line':
					config = angular.extend(config, linechart.initconfig);
					break;
				case 'pie':
					config = angular.extend(config, piechart.initconfig);
					break;
				case 'text':
					config = angular.copy(textchart.initconfig);
					break;
				case 'pic':
					config = angular.copy(picchart.initconfig);
					break;
                case 'cloud':
                    config = angular.copy(cloudchart.initconfig);
				default:
					break;
			}
			config.bindto = '#'+bindto;
            //如果是基本图表的话
			if (!config.toolchart){
				config.data_config = data;
				config.data.columns = data.json;
			}

			return config;
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
				if (config.type == 'text'){
					tmpchart = textchart.draw(config);
				}
				if (config.type == 'pic'){
					tmpchart = picchart.draw(config);
				}
                if (config.type == 'cloud'){
                    tmpchart = cloudchart.draw(config);
                }
			}
			console.log(config);
			return tmpchart;
		}
	}
}])
.directive('ngChartConfig', ['barchart', 'linechart', 'piechart', 'textchart', 'picchart', 'cloudchart', '$compile', function (barchart, linechart, piechart, textchart, picchart, cloudchart, $compile) {
	function choose_chart_config(type){
		switch(type) {
			case 'bar':
				return barchart.config_panel_html;
				break;
			case 'line':
				return linechart.config_panel_html;
				break;
			case 'pie':
				return piechart.config_panel_html;
				break;
			case 'text':
				return textchart.config_panel_html;
				break;
			case 'pic':
				return picchart.config_panel_html;
				break;
            case 'cloud':
                return cloudchart.config_panel_html;
                break;
		}
		return '';
	}

	//匹配Unload数据
	function _findunload(oldcolumn, newcolumn){
		var ks = {};
		for (var i = 0; i < oldcolumn.length; i++){
			ks[oldcolumn[i][0]] = true;
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

			//绑定数据
		    $scope.importData = function(){
		    	var data_config = curchart.chart_config.data_config;
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



var BasicCharts = angular.module('BasicCharts', ['Bar', 'Line', 'Pie'])
.service('basiccharts', [function(barchart, linechart, piechart){


}]);

var ToolsCharts = angular.module('ToolsCharts', ['Text', 'Pic', 'Cloud'])
.service('toolscharts', [function(textchart, picchart, cloudchart){


}]);


var Bar = angular.module('BarChart', [])
.service('barchart', [function(){
	var config_html = $("#barchart_config").html();
	return {
		initconfig: {
			data: {
				type: 'bar'
			},
			name: '柱状图'
		},
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
				type: 'line'
			},
			name: '折线图'
		},
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
				type: 'pie'
			},
			zoom: {
		        enabled: false
		    },
		    name: '饼图'
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
			html: defaulthtml,
			text: defaulthtml
		},
		config_panel_html: config_html,
		draw: function(config){
			$(config.bindto).html(config.html);
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
		link: function ($scope, iElement, iAttrs) {
			var t = TEXT_MARKDOWN().data('markdown');
			t.setContent($scope.config.text);
			$(iElement).click(function(){
				var htmlval = t.parseContent();
				$("#textConfigModal .submitText").unbind('click').bind('click', function(){
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
    var defaulthtml = '请导入词云图数据';

    return {
        initconfig: {
            type: 'cloud',
            name: '词云图',
            toolchart: true,
            html: defaulthtml,
            setting: {
                "size" : {
                    "grid" : 16
                },
                "options" : {
                    "color" : "random-dark",
                    "printMultiplier" : 3
                },
                "font" : "Futura, Helvetica, sans-serif",
                "shape" : "square"
            },
            data_config: {
                string: '{"这是": 12, "一个": 5, "小的": 15, "测试": 13}',
                json: {}
            }
        },
        config_panel_html: config_html,
        draw: function(config){
            console.log(config);
            var parent = $(config.bindto).parent();
            var cc =  $(config.bindto).css({
                width: parent.width(),
                height: parent.height()
            }).awesomeCloud(config.setting);
            cc.redrawchart = function(data){
                $(this).empty();
                for (var i in data.json){
                    $(this).append('<span data-weight='+data.json[i]+'>'+i+'</span>');
                }
                $(this).awesomeCloud(config.setting);
            }
            //$(config.bindto).html(defaulthtml);
            return cc;
        }
    }
}]);