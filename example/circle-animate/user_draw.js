$(function(){
	var nodes = [];
	var scolor = d3.scale.category20();
	var small_radius = 20;
	var big_radius = 100;
	var hover_radius = 40;
	var parentid = 397357;
	var pause = false;

	Date.prototype.nextMonth = function(){
		var now = this;
		if (now.getMonth() == 11) {
		    var current = new Date(now.getFullYear() + 1, 0, 1);
		} else {
		    var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
		}
		return current;
	}

	Date.prototype.toYM = function(){
		var month = this.getMonth() + 1, str = '';
		if (month < 10) str = '0';
		return this.getFullYear() + '-' + str + month;
	}

	var drawPic = new Canvas({
		id: "#chart",
		pathLength: 200,
		onclick: function(obj){
			var pid = obj.id;
			parentid = pid;
			var nodes = drawPic.getNodes();

			jk.utils.filter(nodes, 'type', 'small', function(obj){
				obj.pid = pid;
			}, function(obj){
				obj.type = 'small';
				obj.pid = pid;
				obj.bigger(small_radius);
			});

			obj.pid = 0;
			obj.type = 'big';
			drawPic.restart();
		},
		onmouseover: function(obj){
			if (obj.type == 'small'){
				obj.bigger(hover_radius, 500, 'easeInCubic');
			}
		},
		onmouseout: function(obj){
			if (obj.type == 'small'){
				obj.bigger(small_radius, 500, 'easeOutCubic');
			}
		}
	});

	drawPic.init();

	$("#play").click(function(){
		drawPic.play();
		pause = false;
	});

	$("#pause").click(function(){
		drawPic.pause();
		pause = true;
	});

	$.get('userdata.json', function(data){
		init(data);
	},'json');

	var dataTime = {};
	var dmin = 0;
	var dmax = 0;

	function calcdistance(s){
		var res = (dmax - s) / (dmax - dmin);
		if (res < 0.3) return 0.1;
		if (res < 0.4) return 0.6;
		if (res < 0.6) return 1.1;
		if (res < 0.8) return 1.6;
		return 1;
	}

	function init(data){
		var imagepath = './image/';
		
		dmin = jk.utils.min(data, 'similarity') - 0.01;
		dmax = jk.utils.max(data, 'similarity') + 0.01;
		drawPic.addNode({
			id: parentid,
			type: 'big',
			title: '曹格',
			image: imagepath+'1.jpg',
			immortal: true,
			showtitle: true,
			radius: big_radius
		});

		data.forEach(function(i){
			var type = 'small';
			var radius = small_radius;
			var time = i.time.substring(0, 7);
			if (!dataTime[time]) dataTime[time] = [];
			dataTime[time].push({
				id: i.id,
				type: type,
				title: i.name,
				radius: radius,
				image: imagepath + (Math.ceil(Math.random() * 10)) + '.jpg',
				distance: calcdistance(i.similarity),
				drawpath: false,
				immortal: true,
				showtitle: true,
				initialXY: '2'
			});
		});

		begin();
	}

	function begin(){
		var time = new Date('2013-03');
		function check(t){
			setTimeout(function(){
				time = time.nextMonth();
				var t = month(time.toYM());
				check(t);
			}, t);
		}
		check(1000);

		setTimeout(function(){
			var nodes = drawPic.getNodes();
			jk.utils.filter(nodes, 'id', 397357, function(obj){
				obj.bigger(60, 1000);
			});
		}, 100);
	}

	function month(time){
		console.log(time);
		if (!dataTime[time]) return;
		var nodes = drawPic.getNodes();
		var mintime = 1000;
		var stotime = -1;
		var k = 0;

		//隐藏
		nodes.forEach(function(i){
			if (i.type == 'big' || i.visible == false) return;
			var arr = jk.utils.filter(dataTime[time], 'id', i.id);
			if (arr.length == 0){
				stotime++;
				setTimeout(function() {
					i.hide(500);
				}, stotime * 500);
			}
		});

		if (stotime * 500 > mintime) mintime = stotime * 500;
		
		var stotime = -1;
		//加入新的
		dataTime[time].forEach(function(i){
			var arr = jk.utils.filter(nodes, 'id', i.id, function(obj){
				obj.distance = i.distance;
			});
			if (arr.length == 0){
				stotime++;
				setTimeout(function() {
					i.pid = parentid;
					if (!pause){
						drawPic.addNode(i);
					}
				}, stotime * 500);
			}
		});

		if (stotime * 500 > mintime) mintime = stotime * 500;
		return mintime;
	}

});