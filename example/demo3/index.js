$(function(){

var data = [
    ['data1', 30, 200, 100, 400, 150, 250,30, 200, 100, 400, 150, 250,30, 200, 100, 400, 150, 250,30, 200, 100, 400, 150, 250],
    ['data2', 50, 20, 10, 40, 15, 25,50, 20, 10, 40, 15, 25,50, 20, 10, 40, 15, 25,50, 20, 10, 40, 15, 25]    
];

var chart = [];

var max = 8;
function legendclick(id){
	for (var i = 1; i < max; i++){
		chart[i].toggle(id);
	}
}

function legendonmouseover(id){
	for (var i = 1; i < max; i++){
		chart[i].focus(id);
	}
}

function legendonmouseout(id){
	for (var i = 1; i < max; i++){
		chart[i].focus();
	}
}

function reclacdomain(d){
	var start = Math.ceil(d[0]);
	var end = Math.floor(d[1]);
	var resdata = [];
	for (var i = 0; i < data.length; i++){
		var tmp = [data[i][0]];
		for (var j = start+1; j <= end+1; j++){
			tmp.push(data[i][j]);
		}
		resdata.push(tmp);
	}
	for (var i = 2; i < max; i++){
		chart[i].load({
			columns: resdata
		});
	}
}

var json = [
    ['x', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    ['最高气温', '11', '11', '15', '13', '12', '13', '10'],
    ['平均气温', '6', '4.5', '8.5', '9', '7.5', '7.5', '5'],
    ['最低气温', '1', '-2', '2', '5', '3', '2', '0'],
    ['空气质量', '20', '40', '77', '250', '403', '80', '20'],
    ['活动指数', '10', '9', '7', '5', '4', '2', '8'],
    ['休息指数', '2', '3', '7', '6', '3', '8', '2']
];

var json2 = [["x","周一","周二","周三","周四","周五","周六","周日"],["最高气温","11","11","15","13","12","13","10"],["最低气温","1","-2","2","5","3","2","0"],["平均气温","6","4.5","8.5","9","7.5","7.5","5"]];

    chart[1] = jk.drawChart({
	bindto: '#chart1',
	data: {
        columns: data
    },
    line: {
        title: 'hehehehe'
    },
    zoom: {
        enabled: true,
		onzoomend: function (domain) {
			reclacdomain(domain);
		}
    },
    legend: {
    	item: {
    		onclick: legendclick,
    		onmouseover: legendonmouseover,
    		onmouseout: legendonmouseout
    	}
    }
});

chart[2] = jk.drawChart({
    bindto: '#chart2',
    data: {
        columns: json,
        type: 'bar',
        x: 'x'
    },
    legend: {
    },
    axis: {
        x: {
            type: 'category'
        }
    }
});

    setTimeout(function(){
       chart[2].load({
           columns: json2,
           unload: ["空气质量","活动指数","休息指数"]
       });
    }, 1000);


chart[3] = jk.drawChart({
    bindto: '#chart3',
    data: {
        columns: data,
        type: 'pie'
    },
    legend: {
    	hide: true
    }
});

chart[4] = jk.drawChart({
    bindto: '#chart4',
    data: {
        columns: data,
        type: 'donut'
    },
    donut: {
        title: 'hhhh'
    },
    legend: {
    	hide: true
    }
});

chart[5] = jk.drawChart({
    bindto: '#chart5',
    data: {
        columns: data,
        type: 'scatter'
    },
    legend: {
    	hide: true
    }
});


chart[6] = jk.drawChart({
    bindto: '#chart6',
    data: {
        columns: data,
        type: 'area'
    },
    legend: {
    	hide: true
    }
});

chart[7] = jk.drawChart({
    bindto: '#chart7',
    data: {
        columns: data,
        type: 'bar',
	    groups: [
	        ['data1','data2']
	    ],
    },
    legend: {
    	hide: true
    }
});

});