var basicTreePie = function(options){

	this.width = options.width || 960,
	this.height = options.height || 700,
	this.radius = Math.min(this.width, this.height) / 2,
	this.target = options.target || "body";

	this.click = options.click || null;

	var that = this;
	var _canthover = null;
	
	var x = d3.scale.linear().range([0, 2 * Math.PI]);

	var y = d3.scale.sqrt()
	    .range([0, this.radius]);

	var color = d3.scale.category20c();

	var svg = d3.select(this.target).append("svg")
	    .attr("width", this.width)
	    .attr("height", this.height)
	  .append("g")
	    .attr("transform", "translate(" + this.width / 2 + "," + (this.height / 2 + 10) + ")");

	var partition = d3.layout.partition()
	    .sort(null)
	    .value(function(d) { return d.size; });

	var arc = d3.svg.arc()
	    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
	    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
	    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
	    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

	var node, g, path, text;    

	function computeTextRotation(d) {
  		var angle = x(d.x + d.dx / 2) - Math.PI / 2;
  		return angle / Math.PI * 180;
	}

	function click(d) {
	    node = d;
     	text.transition().attr("opacity", 0);
     	_canthover = true;
	    path.transition()
	    .duration(750)
	    .attrTween("d", arcTweenZoom(d))
	    .each("end", function(e, i) {
	    	_canthover = null;
	        if (e.x >= d.x && e.x < (d.x + d.dx)) {
	            var arcText = d3.select(this.parentNode).select("text");
	            arcText.transition().duration(750)
	              .attr("opacity", 1)
	              .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
	              .attr("x", function(d) { return y(d.y); });
	        }
	    });

	    that.click && that.click(d);
	}

	function arcTween(delay, type) {
	  return function(d) {
	  	if (_canthover) {
	  		return;
	  	}
	    d3.select(this)
	    .transition().delay(delay)
	    .style("fill", function(d){
	    	if (type == 'out')
		    	return d.color;
			else
				return d3.rgb(d.color).darker(1);
	    });
	  };
	}

	this._init = function(root) {
	  node = root;

	  if (!path){
	  	g = svg.selectAll("g")
  		  .data(partition.nodes(node))
    	  .enter().append("g");

    	path = g.append("path");
	  	text = g.append("text");
	  }	

	  g.data(partition.nodes(node));
      
	  path
		.attr("d", arc)
		.style("fill", function(d) { d.color = d.color || color((d.children ? d : d.parent).name); return d.color; })
	    .style({'stroke': 'white', 'stroke-width': 1})
	    .on("click", click)
	    .on("mouseover", arcTween(0, 'over'))
	    .on("mouseout", arcTween(150, 'out'))
	    .each(stash);

	  text
		.attr("x", function(d) { return y(d.y); })
		.attr("dx", "6")
		.attr("dy", ".35em")
		.style({"font-size":"10pt", "fill":"white"})
		.text(function(d) { return d.name; });

	  text.attr("transform", function(d){ return "rotate(" + computeTextRotation(d) + ")"; });

	  path
        .transition()
        .duration(1000)
        .attrTween("d", arcTweenData);
	};

	//d3.select(self.frameElement).style("height", this.height + "px");

	function stash(d) {
	  d.x0 = d.x;
	  d.dx0 = d.dx;
	}

	function arcTweenData(a, i) {
	  var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
	  function tween(t) {
	    var b = oi(t);
	    a.x0 = b.x;
	    a.dx0 = b.dx;
	    return arc(b);
	  }
	  if (i == 0) {
	    var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
	    return function(t) {
	      x.domain(xd(t));
	      return tween(t);
	    };
	  } else {
	    return tween;
	  }
	}

	function arcTweenZoom(d) {
	  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
	      yd = d3.interpolate(y.domain(), [d.y, 1]),
	      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, that.radius]);
	  return function(d, i) {
	    return i
	        ? function(t) { return arc(d); }
	        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
	  };
	}
}


basicTreePie.prototype = {
	init: function(root){		
		var nodes = jk.utils.copy(root);
		this._init(nodes);
	}
}