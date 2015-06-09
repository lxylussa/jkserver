$(function(){
	Date.prototype.getdate = function(){
		var year = this.getFullYear();
		var month = this.getMonth() + 1;
		if (month < 10) month = '0' + month;
		var day = this.getDate();
		if (day < 10) day = '0' + day;
		
		return year + '-' + month + '-' + day;
	}

	var beginTime = new Date('2013-09-01');
	var nodes = [];
	var scolor = d3.scale.category20();

	var drawPic = new Canvas({
		id: "#chart"
	});
	drawPic.init();

	$.get('data.json', function(data){
		init(data);
	},'json');	

	function init(data){
		nodes = data;
		beginTime = new Date();
		var minR = 10;
		var maxR = 20, max = 0;
		nodes.forEach(function(i){
			if (i.number > max) max = i.number; 
			if (i.startTime){
				i.time = new Date(i.startTime);
				i.date = i.time.getdate();
				i.ktitle = _transTopicTitle(i.keyWords);
				if (i.time.getTime() < beginTime.getTime()){
					beginTime = new Date(i.date);
				}
			}else{
				i.time = new Date(i.day * 24 * 60 * 60 * 1000);
				i.date = i.time.getdate();
			}
		});
		nodes.forEach(function(i){
			i.radius = minR + (maxR - minR) * (i.number / max);
		});
		setInterval(function() {
			checkData();
			beginTime.setTime(beginTime.getTime() + 1 * 24 * 60 * 60 * 1000);
		}, 300);
	}

	function checkData(){
		$('.time').text(beginTime.getdate());
		var aniqueue = [];
		nodes.forEach(function(i){
			if (i.keyWords){
				if (i.date == beginTime.getdate()){
					drawPic.addNode({
						node: i,
						id: i.id,
						num: i.number,
						radius: i.radius,
						type: 'big',
						content: i.ktitle,
						title: i.ktitle,
						color: scolor(i.id)
					});
				}
			}else{
				if (i.date == beginTime.getdate()){
					aniqueue.push({
						node: i,
						pid: i.topicid,
						type: 'small',
						content: i.title,
						// drawtail: false
					});
				}
			}
		});
		_aniQue(aniqueue);
	};

	function _transTopicTitle(keyWords){
		var data = [];
		keyWords.split(',').slice(0, 8).forEach(function(i){
			data.push(i.replace(/:.*$/, ''));
		})
		return data.join(',');
	}

	function _aniQue(que){
		if (que.length > 0){
			setTimeout(function() {
				var k = que.pop();
				drawPic.addNode(k);
				_aniQue(que);
			}, 20 + Math.random() * 100);
		}
	}

});