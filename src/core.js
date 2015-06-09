var jk = { version : "0.0.1" }

var chart_fn;

jk.chart = {
	fn : Chart.prototype
}

jk.drawChart = function(config){
	return new Chart(config);
}

function Chart(config){
	var that = this;
	that.d3 = window.d3,
	that.basicChart = that.c3 = window.c3;
	
	that.config = that.getDefaultConfig();
	that.loadConfig(config);
	
	return that.init();
}

chart_fn = jk.chart.fn;

chart_fn.init = function(){
	var that = this;
	if (that.config.type === 'CrCanvas'){
		return new that.CrCanvas(that.config.option);
	}else{
		return that.c3.generate(that.config);
	};
}