var tools = angular.module('Tool', ['Text', 'Pic']);

var text = angular.module('Text', [])
.service('text', [function(){
	return {
		defaultconfig: {
		},
		init: function(type, id, data){
			// var that = this,
			// panel = {
			// 	id: id,
			// 	type: type,
			// 	chart_config: chart.init(type, id, data),
			// 	grid_config: that.defaultconfig.grid_config
			// }
			// return panel;
		}
	}
}]);

var pic = angular.module('Pic', [])
.service('pic', [function () {
	return {
		defaultconfig: {
		},
		init: function(type, id, data){
			
		}
	}
}]);