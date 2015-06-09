var chartbone = angular.module('ChartBone', ['Data', 'Chart', 'Panel']);

chartbone.controller('IndexCtrl', ['$scope', '$http', 'data', 'chart', 'panel', function($scope, $http, data, chart, panel) {
    var gridster;

    $scope.gridster = gridster = null;
    $scope.panels = [];

    //
    //
    //$scope.data.json = [
    //    ['x', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    //    ['最高气温', '11', '11', '15', '13', '12', '13', '10'],
    //    ['平均气温', '6', '4.5', '8.5', '9', '7.5', '7.5', '5'],
    //    ['最低气温', '1', '-2', '2', '5', '3', '2', '0'],
    //    ['空气质量', '20', '40', '77', '250', '403', '80', '20'],
    //    ['活动指数', '10', '9', '7', '5', '4', '2', '8'],
    //    ['休息指数', '2', '3', '7', '6', '3', '8', '2']
    //];

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
            serialize_params: function($w, wgd){
                return {
                    id: $w.children().attr('id'),
                    col: wgd.col,
                    row: wgd.row,
                    size_x: wgd.size_x,
                    size_y: wgd.size_y
                }
            },
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
            $scope.data = {json: {}};
            $scope.addChart('text', {size_x:6, size_y:2});
            $scope.data = {
                string: "",
                json: [
                    ['CPU', 80]
                ]
            };
            $scope.addChart('gauge');
            $scope.data = {
                string: "",
                json: [
                    ['x', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    ['社会', '12', '23', '32', '43', '22', '13', '10'],
                    ['军事', '63', '20', '35', '23', '45', '25', '25'],
                    ['体育', '22', '19', '23', '11', '23', '42', '30'],
                    ['娱乐', '11', '10', '11', '33', '13', '32', '20']
                ]
            };
            $scope.addChart('bar', {size_x:4, size_y:3});
            $scope.data = {
                string: "",
                json: [
                    ['x', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    ['新闻数量', '110', '230', '151', '230', '450', '330', '220'],
                    ['评论等级', '300', '130', '201', '330', '450', '310', '210']
                ]
            };
            $scope.addChart('line');
            $scope.data = {
                string: "",
                json: [
                    ['x', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    ['北京', '11', '31', '25', '43', '22', '13', '10'],
                    ['上海', '26', '45', '8.5', '9', '15', '35', '25'],
                    ['广州', '32', '22', '12', '5', '33', '22', '10']
                ]
            };
            $scope.addChart('bar');
            $scope.data = {
                string: "",
                json: [
                    ['x', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    ['新浪', '11', '31', '25', '43', '22', '13', '10'],
                    ['腾讯', '31', '32', '12', '23', '20', '43', '20'],
                    ['网易', '11', '22', '42', '17', '30', '13', '30'],
                ]
            };
            $scope.addChart('bar', {size_x:4, size_y:3});
            $scope.data = {
                string: "",
                json: [
                    ['新浪', 110],
                    ['腾讯', 90],
                    ['网易', 70]
                ]
            };
            $scope.addChart('pie');
            $scope.data = {
                string: "",
                json: [
                    ['正向新闻', 110],
                    ['负向新闻', 90],
                    ['中性新闻', 420]
                ]
            };
            $scope.addChart('donut',{size_x:3, size_y:5});
            $scope.addChart('cloud',{size_x:3, size_y:5});
            $scope.data = {
                string: "",
                json: [
                    ['x', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    ['社会', '12', '23', '32', '43', '22', '13', '10'],
                    ['军事', '63', '20', '35', '23', '45', '25', '25'],
                    ['体育', '22', '19', '23', '11', '23', '42', '30'],
                    ['娱乐', '11', '10', '11', '33', '13', '32', '20']
                ]
            };
            //$scope.addChart('force');
        })();
    };

    //添加一个图表组件实例
    $scope.addChart = function(type, grid_config){
        if (!$scope.data.json){
            alert('请先填写或导入数据');
            return;
        }
        var data = angular.copy($scope.data);
        var id = genId();
        var p = panel.init(type, id, data);
        if (grid_config){
            p.grid_config = grid_config;
        }
        $scope.panels.push(addNewPanel(p));
    };

    //删除一个图标组件实例
    $scope.deleteChart = function(c){
        var flag = window.confirm('你确定删除此图表吗？');

        if (flag){
            if (c.chart && c.chart.destroy){
                c.chart.destroy();
            }
            gridster.remove_widget(c.el);
            for (var i = 0; i < $scope.panels.length; i++){
                if ($scope.panels[i].id == c.id){
                    $scope.panels.splice(i, 1);
                }
            }
        }
    };

    //导出代码
    $scope.generateCode = function(){
        var config = {};
        config.global_config = $scope.config;
        config.charts_config = [];
        angular.forEach($scope.panels, function(item){
            config.charts_config.push({
                grid_config: angular.copy(item.grid_config),
                chart_config: angular.copy(item.chart_config),
                id: item.id,
                type: item.type
            });
        });
        config.grid_list = $scope.gridster.serialize();

        $http.post('/generate', {config: config}).success(function(data){
            alert('核心代码生成完成');
        });
    }

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
		},
		init: function(type, id, data){
            var configs = chart.init(type, id, data);
            return {
                id: id,
                type: type,
                chart_config: configs.chart_config,
                grid_config: configs.grid_config
            };
		}
	}
}]);