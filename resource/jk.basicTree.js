var basicTree = function(options){

	this.width = options.width || 960,
	this.height = options.height || 700,
	this.target = options.target || "body";
	this.distance = options.distance || 180;
	this.lineStyle = options.lineStype || {
		'stroke': 'gray',
		'stroke-linecap': 'round',
		'stroke-opacity': 0.4,
		'stroke-width': '15px'
	};

	var margin = {top: 0, right: 0, bottom: 0, left: 100},
    step = 100,
    that = this;

	var i = 0,
	    duration = 750,
	    root;

	var tree = d3.layout.tree()
	    .size([this.height, this.width]);

	var color = d3.scale.category20c();

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select(this.target).append("svg")
	    .attr("width", this.width + margin.right + margin.left)
	    .attr("height", this.height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	function update(source) {
	  	// Compute the new tree layout.
	  	var nodes = tree.nodes(root).reverse(),
	    	links = tree.links(nodes);
		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * that.distance; });

		// Update the nodes…
		var node = svg.selectAll("g.node")
		    .data(nodes, function(d) { return d.id || (d.id = ++i); });

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g")
		    .attr("class", "node")
		    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		    .on("click", click);

		nodeEnter.append("circle")
		    .attr("r", function(d){ return 1e-6; })
		    .style("fill", function(d) {
		    	return d._children ? "lightsteelblue" : "#fff";
		    });

		nodeEnter.append("text")
	        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		    .attr("dy", ".35em")
		    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		    .text(function(d) { return d.name; })
		    .style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
		    .duration(duration)
		    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		nodeUpdate.select("circle")
		    .attr("r", function(d){ return d.radius || 4.5; })
		    .style("fill", function(d) {
		    	return d.color || color(d.name); 
		    });

		nodeUpdate.select("text")
		    .style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition()
		    .duration(duration)
		    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		    .remove();

		nodeExit.select("circle")
		    .attr("r", 1e-6);

		nodeExit.select("text")
		    .style("fill-opacity", 1e-6);

		// Update the links…
		var link = svg.selectAll("path.link")
		    .data(links, function(d) { return d.target.id; });

		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g")
		    .attr("class", "link")
		    .style(that.lineStyle)
		    .style('stroke-width', function(d){ return d.target.lineWidth || false; })
		    .style('stroke', function(d){ return d.target.lineColor || false; })
		    .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return diagonal({source: o, target: o});
		    });

		// Transition links to their new position.
		link.transition()
		    .duration(duration)
		    .attr("d", diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition()
		    .duration(duration)
		    .attr("d", function(d) {
		        var o = {x: source.x, y: source.y};
		        return diagonal({source: o, target: o});
		    })
		    .remove();

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		});
	}

	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update(d);
	}

	this._init = function(data){
	  root = data;
	  root.x0 = this.height / 2;
	  root.y0 = 0;

	  function collapse(d) {
	    if (d.children) {
	      d._children = d.children;
	      d._children.forEach(collapse);
	      d.children = null;
	    }
	    d.haschildren = true;
	  }

	  root.children.forEach(collapse);
	  update(root);
	};

	this._to = function(data){
		this._init(data);
	}
}


basicTree.prototype = {
	init: function(root){
		var nodes = jk.utils.copy(root);
		this._init(nodes);
	},
	to: function(todata){
		var nodes = jk.utils.copy(todata);
		this._to(nodes);
	}
}