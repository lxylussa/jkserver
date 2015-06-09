$(function(){
	var bc = null, data = null;
	var color = d3.scale.category20c();
	function ind(data){
		data.color = color(data.name);
		data.lineColor = data.color;
		if (data['size']){
			if (data['size'] == 1){
				data['size'] = data['oldsize'];
			}else{
				data['oldsize'] = data['size'];
				data['size'] = 1;
			}
			return;
		}else{
			for (var i in data['children']){
				ind(data['children'][i]);
			}
		}
		return data;
	}

	function _parsedata(root){
		var r = {name: root.name, color: root.color, lineColor: root.lineColor};
		if (root.children){
			r.children = [];
			for(var i = 0; i < root.children.length; i++){
				r.children.push(_parsedata(root.children[i]));
			}
		}else{
			r.size = root.size;
		}
		return r;
	}

	$("#data").click(function(){
		d3.json("flare.json", function(error,root){
			$(".leftbox").empty();
			$(".rightbox").empty();
			data = root;
			bc = new basicTreePie({
				target: '.leftbox',
				width:  $(".leftbox").width(),
				height: 500,
				click: function(d){
					var dd = _parsedata(d);
					tc.to(dd);
				}
			});
			bc.init(data);
			
			$("#button").click(function(){
				ind(data);
				bc.init(data);
			});

			tc = new basicTree({
				target: '.rightbox',
				width: $(".rightbox").width(),
				height: 500
			});
			tc.init(data);
		});
	});

	d3.json("flare_sample.json", function(error, root){
		data = ind(root);
		bc = new basicTreePie({
			target: '.leftbox',
			width: $(".leftbox").width(),
			height: 800,
			click: function(d){
				var dd = _parsedata(d);
				tc.to(dd);
			}
		});
		bc.init(data);
		
		$("#button").click(function(){
			data = ind(data);
			bc.init(data);
		});

		tc = new basicTree({
			target: '.rightbox',
			width: $(".rightbox").width(),
			height: 800
		});
		tc.init(data);
	});

});