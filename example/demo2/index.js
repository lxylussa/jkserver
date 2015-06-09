$(function(){

var jkchart = jk.drawChart({
	type: 'CrCanvas',
	option: {
		id: "#chart",
		onclick: function(n){
		},
		onmouseout: function(d){
		}
	}
});

var drawPic = jkchart.chart;

drawPic.init();
drawPic.addNode({
	id: 1,
	radius: 40,
	type: 'big',
	content: 'null',
	title: 'test1',
	immortal: true,
});

});