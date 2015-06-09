var chartbone = angular.module('ChartBone', ['Data', 'Chart', 'Panel']);

chartbone.controller('IndexCtrl', ['$scope', 'data', 'chart', 'panel', function($scope, data, chart, panel) {
    var gridster;

    $scope.gridster = gridster = null;
    $scope.panels = [];

    $scope.data = {
        string: "[\n['data1', 30, 200, 100, 400, 150, 250],\n['data2', 50, 20, 10, 40, 15, 25]\n]",
        json: null
    };

    $scope.data.json = [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
    ];

    $scope.color = [
        ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c'],
        ['#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5'],
        ['#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f'],
        ['#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
        ['#2549FF', '#2277E8', '#32C0FF', '#22DFE8', '#25FFCC']
    ];

    $scope.config = {
        canvas: {
            width: 690
        },
        grid: {
            widget_margins: [5, 5],
            widget_base_dimensions: [100, 55]
        },
        color: {
            pattern: $scope.color[0]
        }
    };

    //改变数据配色
    $scope.changeColorPattern = function(color){
        var c = angular.copy(color);
        c = c.splice(0, c.length);
        $scope.config.color.pattern = c;
        $scope.$emit('chartColorChange', c);
    };

    //导入数据
    $scope.importData = function(){
        $scope.$emit('Data-OpenModal', {
            data: $scope.data,
            callback: function(obj){
                $scope.data = obj;
                $scope.addChart('bar');
            }
        });
    };

    //重置排版布局
    $scope.createCanvas = function(){
        $scope.gridster = gridster = $(".gridster ul").gridster({
            widget_base_dimensions: $scope.config.grid.widget_base_dimensions,
            widget_margins: $scope.config.grid.widget_margins,
            resize: {
                enabled: true,
                start: function(e, ui, w){
                    $(w).find('div').hide();
                },
                stop: function(e, ui, w){
                    $(w).find('div').show();
                    var id = $(w).find('div').attr('id');
                    angular.forEach($scope.panels, function(item){
                        if (item.id == id){
                            item.chart_config.size = {
                                width: $(w).width(),
                                height: $(w).height()
                            };
                            if (item.chart){
                                item.chart.resize(item.chart_config.size);
                            }
                        }
                    });
                }
            }
        }).data('gridster');

        (function(){
            $scope.addChart('bar');
            $scope.addChart('line');
            $scope.addChart('pie');
            $scope.addChart('text');
            $scope.addChart('pic');
            $scope.addChart('cloud');
        })();
    };

    //添加一个图表组件实例
    $scope.addChart = function(type){
        if (!$scope.data.json){
            alert('请先填写或导入数据');
            return;
        }
        var data = angular.copy($scope.data);
        var id = genId();
        var p = panel.init(type, id, data);
        $scope.panels.push(addNewPanel(p));
    };
    
    $scope.deleteChart = function(c){
        var flag = window.confirm('你确定删除此图表吗？');

        if (flag){
            c.chart.destroy();
            gridster.remove_widget(c.el);
            for (var i = 0; i < $scope.panels.length; i++){
                if ($scope.panels[i].id == c.id){
                    $scope.panels.splice(i, 1);
                }
            }
        }
    };

    function genId(){
        var a = 'abcdefghijklmnopqrstuvwxyz';
        var b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var i = Math.floor(Math.random()*26);
        var j = Math.floor(Math.random()*26);
        return 'chart-panel-'+a[i]+b[j]+Math.floor(Math.random()*10000);
    }

    function addNewPanel(p){
    	p.el = addWidget(p.id, p.grid_config);
    	p.chart = chart.draw(p.chart_config);
    	return p;
    }

    function addWidget(id, gridconfig){
		return gridster.add_widget('<li><div class="panel-div" id="'+id+'"></div></li>', gridconfig.size_x, gridconfig.size_y, gridconfig.col, gridconfig.row);
    }

    setTimeout(function(){
        $scope.createCanvas();
        $scope.$apply();
    },500);
}]);

var panel = angular.module('Panel', ['Chart'])
.service('panel', ['chart', function(chart){
	return {
		defaultconfig: {
			grid_config: {
				size_x: 3,
				size_y: 3	
			}
		},
		init: function(type, id, data){
            var that = this;
            return {
                id: id,
                type: type,
                chart_config: chart.init(type, id, data),
                grid_config: that.defaultconfig.grid_config
            };
		}
	}
}]);