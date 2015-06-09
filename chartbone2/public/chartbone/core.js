(function (window, undefined) {
    var Chartbone = function () {
        this.id = "chartbone";
    };
window.config = {"global_config":{"canvas":{"width":690},"grid":{"widget_margins":[5,5],"widget_base_dimensions":[100,55]},"color":{"pattern":["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c"]}},"charts_config":[{"grid_config":{"size_x":6,"size_y":3},"chart_config":{"type":"text","name":"富文本","toolchart":true,"html":"# EventTeller - 互联网话题事件追踪\n### Created by DBIIR\n\n话题追踪历史回顾精确定位","text":"# EventTeller - 互联网话题事件追踪\n### Created by DBIIR\n\n话题追踪历史回顾精确定位","bindto":"#chart-panel-iM5338"},"id":"chart-panel-iM5338","type":"text"},{"grid_config":{"size_x":2,"size_y":3},"chart_config":{"data":{"type":"gauge","columns":[["I0",50]],"colors":{"I0":"#1f77b4"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":false},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"gauge":{},"name":"度量图","bindto":"#chart-panel-bL8896","data_config":{"string":"","json":[["CPU",80]]},"size":{"width":210,"height":185}},"id":"chart-panel-bL8896","type":"gauge"},{"grid_config":{"size_x":2,"size_y":3},"chart_config":{"data":{"type":"gauge","columns":[["I0",50]],"colors":{"I0":"#1f77b4"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":false},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"gauge":{},"name":"度量图","bindto":"#chart-panel-mP5446","data_config":{"string":"","json":[["内存",30]]},"size":{"width":210,"height":185}},"id":"chart-panel-mP5446","type":"gauge"},{"grid_config":{"size_x":2,"size_y":3},"chart_config":{"data":{"type":"gauge","columns":[["I0",50]],"colors":{"I0":"#1f77b4"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":false},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"gauge":{},"name":"度量图","bindto":"#chart-panel-lY9077","data_config":{"string":"","json":[["I0",50]]},"size":{"width":210,"height":185}},"id":"chart-panel-lY9077","type":"gauge"},{"grid_config":{"size_x":3,"size_y":3},"chart_config":{"data":{"type":"bar","x":"x","columns":[["x","周一","周二","周三","周四","周五","周六","周日"],["新浪","11","31","25","43","22","13","10"],["腾讯","31","32","12","23","20","43","20"],["网易","11","22","42","17","30","13","30"]],"colors":{"新浪":"#1f77b4","腾讯":"#ff7f0e","网易":"#2ca02c"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":true},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"name":"柱状图","bindto":"#chart-panel-lP2761","data_config":{"string":"","json":[["x","周一","周二","周三","周四","周五","周六","周日"],["最热新闻","11","11","15","13","12","13","10"],["最冷新闻","6","4.5","8.5","9","7.5","7.5","5"],["热门新闻","1","-2","2","5","3","2","0"]]},"size":{"width":320,"height":185}},"id":"chart-panel-lP2761","type":"bar"},{"grid_config":{"size_x":3,"size_y":3},"chart_config":{"data":{"type":"bar","x":"x","columns":[["x","周一","周二","周三","周四","周五","周六","周日"],["新浪","11","31","25","43","22","13","10"],["腾讯","31","32","12","23","20","43","20"],["网易","11","22","42","17","30","13","30"]],"colors":{"新浪":"#1f77b4","腾讯":"#ff7f0e","网易":"#2ca02c"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":true},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"name":"柱状图","bindto":"#chart-panel-kL7451","data_config":{"string":"","json":[["x","周一","周二","周三","周四","周五","周六","周日"],["社会","12","23","32","43","22","13","10"],["军事","63","20","35","23","45","25","25"],["体育","22","19","23","11","23","42","30"],["娱乐","11","10","11","33","13","32","20"]]},"size":{"width":320,"height":185}},"id":"chart-panel-kL7451","type":"bar"},{"grid_config":{"size_x":3,"size_y":3},"chart_config":{"data":{"type":"bar","x":"x","columns":[["x","周一","周二","周三","周四","周五","周六","周日"],["新浪","11","31","25","43","22","13","10"],["腾讯","31","32","12","23","20","43","20"],["网易","11","22","42","17","30","13","30"]],"colors":{"新浪":"#1f77b4","腾讯":"#ff7f0e","网易":"#2ca02c"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":true},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"name":"柱状图","bindto":"#chart-panel-dS2518","data_config":{"string":"","json":[["x","周一","周二","周三","周四","周五","周六","周日"],["北京","11","31","25","43","22","13","10"],["上海","26","45","8.5","9","15","35","25"],["广州","32","22","12","5","33","22","10"]]},"size":{"width":320,"height":185}},"id":"chart-panel-dS2518","type":"bar"},{"grid_config":{"size_x":3,"size_y":3},"chart_config":{"data":{"type":"bar","x":"x","columns":[["x","周一","周二","周三","周四","周五","周六","周日"],["新浪","11","31","25","43","22","13","10"],["腾讯","31","32","12","23","20","43","20"],["网易","11","22","42","17","30","13","30"]],"colors":{"新浪":"#1f77b4","腾讯":"#ff7f0e","网易":"#2ca02c"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":true},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"name":"柱状图","bindto":"#chart-panel-sE2960","data_config":{"string":"","json":[["x","周一","周二","周三","周四","周五","周六","周日"],["新浪","11","31","25","43","22","13","10"],["腾讯","31","32","12","23","20","43","20"],["网易","11","22","42","17","30","13","30"]]},"size":{"width":320,"height":185}},"id":"chart-panel-sE2960","type":"bar"},{"grid_config":{"size_x":3,"size_y":3},"chart_config":{"data":{"type":"line","x":"x","columns":[["x","周一","周二","周三","周四","周五","周六","周日"],["新闻数量","110","230","151","230","450","330","220"],["评论等级","300","130","201","330","450","310","210"]],"colors":{"新闻数量":"#1f77b4","评论等级":"#ff7f0e"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":true},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"name":"折线图","bindto":"#chart-panel-hZ914","data_config":{"string":"","json":[["x","周一","周二","周三","周四","周五","周六","周日"],["新闻数量","110","230","151","230","450","330","220"],["评论等级","300","130","201","330","450","310","210"]]},"size":{"width":320,"height":185}},"id":"chart-panel-hZ914","type":"line"},{"grid_config":{"size_x":2,"size_y":3},"chart_config":{"data":{"type":"pie","columns":[["新浪",110],["腾讯",90],["网易",70],["人民网",70],["其他",270]],"colors":{"新浪":"#1f77b4","腾讯":"#ff7f0e","网易":"#2ca02c","人民网":"#d62728","其他":"#9467bd"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":false},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"name":"饼图","bindto":"#chart-panel-tJ7775","data_config":{"string":"","json":[["新浪",110],["腾讯",90],["网易",70],["人民网",70],["其他",270]]},"size":{"width":210,"height":185}},"id":"chart-panel-tJ7775","type":"pie"},{"grid_config":{"size_x":2,"size_y":3},"chart_config":{"data":{"type":"donut","columns":[["正向新闻",110],["负向新闻",90],["中性新闻",420]],"colors":{"正向新闻":"#1f77b4","负向新闻":"#ff7f0e","中性新闻":"#2ca02c"}},"color":{},"padding":{"top":10,"right":10,"bottom":10},"zoom":{"enabled":false},"legend":{"show":true,"item":{}},"axis":{"x":{"show":"show","type":"category","label":{}},"y":{"show":"show","label":{}}},"donut":{"title":"新闻情感"},"name":"圆环图","bindto":"#chart-panel-xM2151","data_config":{"string":"","json":[["正向新闻",110],["负向新闻",90],["中性新闻",420]]},"size":{"width":210,"height":185}},"id":"chart-panel-xM2151","type":"donut"},{"grid_config":{"size_x":3,"size_y":3},"chart_config":{"type":"cloud","name":"词云图","toolchart":true,"setting":{"size":{"grid":16,"factor":0,"normalize":true},"options":{"color":"random-dark","printMultiplier":3,"sort":"highest"},"font":"Futura, Helvetica, sans-serif","shape":"circle"},"data_config":{"string":"{\"通话\":\"007\",\"电话\":\"004\",\"进行\":\"004\",\"航班\":\"018\",\"残骸\":\"002\",\"物体\":\"004\",\"机组\":\"002\",\"工作\":\"004\",\"对话\":\"002\",\"握手\":\"002\",\"图像\":\"003\",\"印度洋\":\"003\",\"区域\":\"003\",\"回应\":\"003\",\"马航\":\"006\",\"否认\":\"006\",\"进展\":\"002\",\"最新\":\"002\",\"首次\":\"004\",\"晚安\":\"002\",\"军方\":\"008\",\"机长\":\"004\",\"搜救\":\"007\",\"调查\":\"015\",\"代表\":\"003\",\"一个\":\"002\",\"人员\":\"004\",\"黑匣子\":\"006\",\"确认\":\"002\",\"团队\":\"003\",\"联系\":\"007\",\"消息\":\"003\",\"中新网\":\"002\",\"是否\":\"004\",\"时间\":\"002\",\"部分\":\"002\",\"家属\":\"022\",\"雷达\":\"008\",\"得到\":\"002\",\"马方\":\"136\",\"飞机\":\"011\",\"法国\":\"004\",\"收获\":\"002\",\"恢复\":\"004\",\"继续\":\"006\",\"有关\":\"002\",\"期间\":\"002\",\"努力\":\"002\",\"客机\":\"029\",\"敏感\":\"003\",\"公布\":\"009\",\"模拟器\":\"005\",\"隐瞒\":\"005\",\"线索\":\"002\",\"相关\":\"004\",\"高级\":\"003\",\"最后\":\"006\",\"飞行员\":\"005\",\"沟通\":\"003\",\"保持\":\"002\",\"中国\":\"007\",\"正常\":\"002\",\"不能\":\"003\",\"370\":\"016\",\"没有\":\"003\",\"飞行\":\"011\",\"记录\":\"003\",\"机上\":\"003\",\"承认\":\"006\",\"质疑\":\"002\",\"透露\":\"005\",\"盲区\":\"002\",\"搜索\":\"006\",\"失联\":\"050\",\"可能\":\"012\",\"122个\":\"004\",\"卫星\":\"020\",\"发布\":\"005\",\"会议\":\"002\",\"25日\":\"002\",\"通讯\":\"002\",\"特殊\":\"002\",\"深海\":\"003\",\"数据\":\"011\",\"重心\":\"003\",\"民航局\":\"002\",\"信息\":\"014\",\"搜寻\":\"007\",\"考虑\":\"004\",\"坠毁\":\"002\",\"小时\":\"005\",\"确定\":\"002\",\"表示\":\"002\",\"要求\":\"004\",\"乘客\":\"011\",\"发布会\":\"004\",\"细节\":\"005\",\"发现\":\"011\",\"安排\":\"002\",\"宣布\":\"002\"}","json":{}},"bindto":"#chart-panel-eL2751"},"id":"chart-panel-eL2751","type":"cloud"},{"grid_config":{"size_x":6,"size_y":5},"chart_config":{"type":"force","name":"力导向布局图","toolchart":true,"setting":{},"data_config":{"string":"[{\"id\":\"1\",\"children\":[{id:\"11\"},{id:\"12\"},{id:\"13\"},{id:\"14\"},{id:\"15\"}]},{\"id\":\"2\",\"children\":[{id:\"21\"},{id:\"22\"},{id:\"23\"},{id:\"24\"},{id:\"25\"},{id:\"26\"},{id:\"27\"},{id:\"28\"},{id:\"29\"},{id:\"20\"}]},{\"id\":\"3\",\"children\":[{id:\"31\"},{id:\"32\"},{id:\"33\"}]},{\"id\":\"4\",\"children\":[{id:\"41\"},{id:\"42\"},{id:\"43\"},{id:\"44\"},{id:\"45\"}]},{\"id\":\"5\",\"children\":[{id:\"51\"},{id:\"52\"},{id:\"53\"},{id:\"54\"}]}]","json":{}},"bindto":"#chart-panel-eW9895"},"id":"chart-panel-eW9895","type":"force"}],"grid_list":[{"id":"chart-panel-iM5338","col":1,"row":1,"size_x":6,"size_y":3},{"id":"chart-panel-bL8896","col":1,"row":4,"size_x":2,"size_y":3},{"id":"chart-panel-mP5446","col":3,"row":4,"size_x":2,"size_y":3},{"id":"chart-panel-lY9077","col":5,"row":4,"size_x":2,"size_y":3},{"id":"chart-panel-lP2761","col":1,"row":7,"size_x":3,"size_y":3},{"id":"chart-panel-kL7451","col":4,"row":7,"size_x":3,"size_y":3},{"id":"chart-panel-dS2518","col":1,"row":10,"size_x":3,"size_y":3},{"id":"chart-panel-sE2960","col":4,"row":10,"size_x":3,"size_y":3},{"id":"chart-panel-hZ914","col":1,"row":13,"size_x":3,"size_y":3},{"id":"chart-panel-tJ7775","col":4,"row":13,"size_x":2,"size_y":3},{"id":"chart-panel-xM2151","col":1,"row":16,"size_x":2,"size_y":3},{"id":"chart-panel-eL2751","col":3,"row":16,"size_x":3,"size_y":3},{"id":"chart-panel-eW9895","col":1,"row":19,"size_x":6,"size_y":5}]};

var appcharts = [];

//鼠标点击legend
function legendclick(id) {
    for (var i = 0; i < appcharts.length; i++) {
        appcharts[i].toggle(id);
    }
}

//鼠标hover
function legendonmouseover(id) {
    for (var i = 0; i < appcharts.length; i++) {
        appcharts[i].focus(id);
    }
}

//鼠标mouseout
function legendonmouseout() {
    for (var i = 0; i < appcharts.length; i++) {
        appcharts[i].focus();
    }
}

//zoom响应
function reclacdomain(d, e) {
    var start = Math.ceil(d[0]);
    var end = Math.floor(d[1]);
    for (var i = 0; i < appcharts.length; i++) {
//只更改其他图表
        if (e.element.id != appcharts[i].element.id) {
            if (_canZoom(appcharts[i])) {
                appcharts[i].zoom(d);
            } else {
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
function _canZoom(chart) {
    var canZoomType = ['line', 'bar'];
    for (var i = 0; i < canZoomType.length; i++) {
        if (chart.type == canZoomType[i]) return true;
    }
    return false;
}

//按照图表根据domain计算区域
function _calcNewDataByDomain(data, start, end) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var id = data[i].id;
        var values = data[i].values;
        var v_start = 0, v_end = values.length - 1;
        while (values[v_start].x < start) v_start++;
        while (values[v_end].x > end) v_end--;
        var tmp = [id];
        for (var j = v_start; j <= v_end; j++) {
            tmp.push(values[j].value);
        }
        res.push(tmp);
    }
    return res;
}
var global_config = config.global_config;
var charts_config = config.charts_config;
var grid_list = config.grid_list;

function grid_init() {
    var boneid = '#' + chartbone.id;
    $(boneid).addClass('gridster ready').css({
        width: global_config.canvas.width
    }).append('<ul />');

    var gridster = $(boneid + ' ul').gridster({
        widget_base_dimensions: global_config.grid.widget_base_dimensions,
        widget_margins: [5, 5]
    }).data('gridster');

    gridster.disable();

    for (var i = 0, l = grid_list.length; i < l; i++){
        for (var j = i+1; j < l; j++){
            if (grid_list[i].row > grid_list[j].row){
                var tmp = grid_list[i];
                grid_list[i] = grid_list[j];
                grid_list[j] = tmp;
            }
        }
    }

    $.each(grid_list, function () {
        gridster.add_widget('<li><div class="panel-div" id="' + this.id + '"></div></li>', this.size_x, this.size_y, this.col, this.row);
    });
}

function chart_init() {
    $.each(charts_config, function () {
        switch (this.type) {
            case 'line':
                ;
            case 'pie':
                ;
            case 'donut':
                ;
            case 'bar':
                _drawCharts(this);
                break;
            case 'text':
                _drawTexts(this);
                break;
            case 'pic':
                _drawPic(this);
                break;
            case 'cloud':
                _drawCloud(this);
                break;
            case 'force':
                _drawForce(this);
                break;
        }
    });
}


function _drawCharts(c) {
    if (c.type == 'bar' || c.type == 'line' || c.type == 'pie' || c.type == 'donut') {
        c.chart_config.legend.item = {
            onclick: legendclick,
            onmouseover: legendonmouseover,
            onmouseout: legendonmouseout
        };
        c.chart_config.zoom.onzoomend = function (domain) {
            reclacdomain(domain, this);
        };
        var chart = jk.drawChart(c.chart_config);
        appcharts.push(chart);
    }
}

function _drawTexts(c) {
    $('#' + c.id).addClass('markdown').html(c.chart_config.html).parent().addClass('nobgcolor');
}

function _drawPic(c) {
    if (c.chart_config.imgurl) {
        $('#' + c.id).html('<img style="width:100%" src="' + c.chart_config.imgurl + '" />');
    }
}

function _drawCloud(c) {
    var parent = $('#' + c.id).parent();
    $('#' + c.id).css({
        width: parent.width(),
        height: parent.height()
    });
    var data = c.chart_config.data_config.json;
    for (var i in data) {
        $('#' + c.id).append('<span data-weight=' + data[i] + '>' + i + '</span>');
    }
    $('#' + c.id).awesomeCloud(c.chart_config.setting);
}

function _drawForce(c){
    var config = c.chart_config;
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
    cc.crcanvas.empty();
    $.each(config.data_config.json, function(){
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

Chartbone.prototype = {
    init: function (options) {
        this.id = options.id;
        grid_init();
        chart_init();
    }
}
window.chartbone = new Chartbone();
})
(window);
