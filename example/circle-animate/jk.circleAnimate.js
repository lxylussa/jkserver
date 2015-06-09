/**
 * Created by jackiex on 15/4/1.
 */
var Canvas = function(options) {
    /**
     * options
     * id targetid
     * width canvas width
     * height canvas height
     * nodeLife
     * rateFlash
     * pathLength
     */
    this.id = options.id || '#chart';
    this.target = $(this.id);
    this.width = options.width || this.target.width();
    this.height = options.height || this.target.height();
    this.style = options.style || {
        'background-color': 'black',
        'position': 'absolute'
    };

    this.nodeLife = options.nodeLife || 10;
    this.rateFlash = options.rateFlash || 2.5;
    this.pathLength = options.pathLength || 0;

    this.onclick = options.onclick || function(){};
    this.onmouseover = options.onmouseover || function(){};
    this.onmouseout = options.onmouseout || function(){};

    var nodes = this.nodes = [];
    var that = this;
    var _force = this.force = d3.layout.force()
        .stop()
        .size([this.width - 200, this.height])
        .friction(.75)
        .gravity(0)
        .charge(function(d) {return - d.radius; })
        .nodes([]);

    var _forceAuthor = d3.layout.force()
        .stop()
        .size([this.width - 200, this.height])
        .gravity(.025)
        .charge(function(d) {
            return - ( 25 + d.radius ) * 8;
        })
        .nodes([]);

    var zoomScale = d3.scale.linear()
        .range([5, 1])
        .domain([.1, 1]);

    var lastEvent = {
        translate: [0, 0],
        scale: 1
    };

    var xW = d3.scale.linear()
        .range([0, this.width])
        .domain([0, this.width]);

    var yH = d3.scale.linear()
        .range([0, this.height])
        .domain([0, this.height]);

    var _isdraging = false;
    var zoom = d3.behavior.zoom()
        .scaleExtent([.1, 8])
        .scale(1)
        .translate([0, 0])
        .on("zoom", function () {
            if (_isdraging) {
                _lastEvent = lastEvent;
                return;
            }
            lastEvent.translate = d3.event.translate.slice(0);
            lastEvent.scale = d3.event.scale;

            var tl = lastEvent.translate[0] / lastEvent.scale,
                tt = lastEvent.translate[1] / lastEvent.scale;

            xW.range([-tl, -tl + that.width / lastEvent.scale])
                .domain([0, that.width]);
            yH.range([-tt, -tt + that.height / lastEvent.scale])
                .domain([0, that.height]);

        });

    var extColor = d3.scale.category20();

    var canvas = d3.select(this.id).append("canvas")
        .attr("width", this.width)
        .attr("height", this.height)
        .style(this.style)
        .call(zoom)
        .node();

    this.canvas = canvas;

    var context = canvas.getContext("2d");

    bufCanvas = document.createElement("canvas");
    bufCanvas.width = this.width;
    bufCanvas.height = this.height;

    bufCtx = bufCanvas.getContext("2d");
    bufCtx.globalCompositeOperation = 'lighter';

    _force.on("tick", function(e) {
        if (that._pause) return;

        if (_force.nodes()) {
            _force.nodes()
                .filter(function(d){
                    return d.visible && d.opacity;
                })
                .forEach(cluster(0.025));

            _forceAuthor.nodes(
                _forceAuthor.nodes()
                    .filter(function(d) {
                        blink(d, !d.immortal);
                        if (d.visible) {
                            d.flash = 0;
                            d.alive = d.alive--;
                        }
                        return d.visible;
                    })
            );
        }
        _forceAuthor.resume();
        _force.resume();
    });

    _force.start();
    _forceAuthor.start();

    function cluster(alpha) {
        return function(d) {
            blink(d, !d.immortal);
            if (!d.pid)
                return;
            var node = nodes.filter(function(t){
                if (t.type == 'big' && t.id == d.pid){
                    return true;
                }
            })[0];
            if (!node) return;
            var l,
                r,
                x,
                y;
            if (node == d) return;
            x = d.x - node.x;
            y = d.y - node.y;
            l = Math.sqrt(x * x + y * y);
            r = that.pathLength * (d.distance || 0) + node.radius + d.radius + 20;
            if (l != r) {
                l = (l - r) / (l || 1) * (alpha || 1);
                x *= l;
                y *= l;

                if (d.tofar){
                    if (l < 0){
                        d.x -= x;
                        d.y -= y;
                    }else{
                        d.x += x;
                        d.y += y;
                    }
                }else{
                    d.x -= x;
                    d.y -= y;
                }
            }

            d.drawtail && d.paths && (d.flash || d.paths.length > 1) && d.paths.push({
                x : d.x,
                y : d.y
            });
        };
    }

    function drawTail(c, d, x, y, vanishing) {
        if (!vanishing)
            bufCtx.beginPath();

        bufCtx.strokeStyle = c.toString();
        bufCtx.lineJoin = "round";
        bufCtx.lineWidth = 1;//(radius(nr(d)) / 4)  || 1;

        var cura = bufCtx.globalAlpha;

        var rs = d.paths.slice(0).reverse()
            , lrs = rs.length
            , p;

        if (!vanishing) {
            bufCtx.moveTo(x, y);
            for (p in rs) {
                if (!rs.hasOwnProperty(p))
                    continue;

                bufCtx.lineTo(
                    Math.floor(rs[p].x),
                    Math.floor(rs[p].y)
                );
            }
            bufCtx.stroke();
        }
        else {
            for (p in rs) {
                if (!rs.hasOwnProperty(p))
                    continue;

                bufCtx.beginPath();
                if (p < 1)
                    bufCtx.moveTo(x, y);
                else
                    bufCtx.moveTo(
                        Math.floor(rs[p - 1].x),
                        Math.floor(rs[p - 1].y)
                    );
                bufCtx.lineTo(
                    Math.floor(rs[p].x),
                    Math.floor(rs[p].y)
                );
                bufCtx.closePath();
                bufCtx.stroke();
                bufCtx.globalAlpha = ((lrs - p) / lrs) * cura;
            }
            bufCtx.globalAlpha = cura;
        }

    }

    function _refreshCanvas() {
        bufCtx.save();

        bufCtx.clearRect(0, 0, that.width, that.height);
        bufCtx.translate(lastEvent.translate[0], lastEvent.translate[1]);
        bufCtx.scale(lastEvent.scale, lastEvent.scale);

        //=========画所有的点
        nodes.filter(function(d){
            // return d.type == 'big';
            return d.opacity && d.visible;
        }).forEach(function(d){
            //画小点 and 线
            if (d.type == 'small'){
                var c = d, p;
                bufCtx.globalCompositeOperation = 'source-over';

                if (c.drawpath){
                    var cp = nodes.filter(function(t){
                        if (t.type == 'big' && t.id == c.pid){
                            return true;
                        }
                    })[0];
                    bufCtx.globalAlpha = 0.5;
                    bufCtx.strokeStyle="#fff";
                    bufCtx.lineWidth = 4;
                    bufCtx.beginPath();
                    bufCtx.moveTo(c.x, c.y);
                    var cx = 0, cy = 0, ll = Math.sqrt((c.y - cp.y) * (c.y - cp.y) + (c.x - cp.x) * (c.x - cp.x));
                    cy = cp.y - cp.radius / ll * (cp.y - c.y);
                    cx = cp.x - cp.radius / ll * (cp.x - c.x);

                    bufCtx.lineTo(cx, cy);
                    bufCtx.stroke();
                }
                bufCtx.globalAlpha = c.opacity * .01;

                if (c.imagepattern){
                    p = c.imagepattern;
                }else
                if (c.image){
                    p = c.imagepattern = pattern(c.imagefile);
                }else{
                    p = c.imagepattern = colorize(c.imagefile, c.rgb.r, c.rgb.g, c.rgb.b, 1);
                }

                bufCtx.drawImage(p, c.x - c.radius, c.y - c.radius, c.radius * 2, c.radius * 2);

                if (c.title && c.opacity > 0 && c.showtitle){
                    bufCtx.globalAlpha = c.opacity * .01;
                    bufCtx.textAlign='center';
                    bufCtx.fillStyle = "white";
                    bufCtx.fillText(c.title, c.x, c.y + c.radius + 15);
                }

                if (c.drawtail)
                    drawTail(c.color, c, c.x, c.y, true);
            }

            //画大点
            if (d.type == 'big'){
                bufCtx.globalAlpha = d.opacity * .01;
                if (d.image){
                    var p;
                    if (d.imagepattern){
                        p = d.imagepattern;
                    }else{
                        p = d.imagepattern = pattern(d.imagefile);
                    }
                    bufCtx.drawImage(p, d.x - d.radius, d.y - d.radius, d.radius * 2, d.radius * 2);
                }else{
                    bufCtx.strokeStyle = 'transparent';
                    bufCtx.fillStyle = d.color;
                    bufCtx.beginPath();
                    bufCtx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
                    bufCtx.closePath();
                    bufCtx.fill();
                    bufCtx.stroke();
                }

                // 画标题
                if (d.title && d.opacity > 0){
                    bufCtx.globalAlpha = d.opacity * .01;
                    bufCtx.textAlign='center';
                    var c = "white";

                    bufCtx.fillStyle = c;
                    bufCtx.fillText(d.title, d.x, d.y + d.radius + 15);
                }
                //当发生hover
                if (d.onhover){
                    bufCtx.textAlign='left';
                    bufCtx.globalAlpha = 1;
                    bufCtx.fillStyle = 'white';
                    bufCtx.fillText(d.content, d.x + d.radius, d.y + d.radius);
                }
            }
        });

        bufCtx.restore();
    }

    function pattern(img){
        if (!img || !img.width)
            return img;
        var tempFileCanvas = document.createElement("canvas");
        var context = tempFileCanvas.getContext("2d");
        var wh = img.width;
        if (img.height > wh) wh = img.height;
        tempFileCanvas.width = tempFileCanvas.height = wh;

        context.save();
        context.beginPath();
        context.arc(wh/2, wh/2, wh/2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        context.drawImage(img, 0, 0, wh, wh);

        context.beginPath();
        context.arc(0, 0, wh/2, 0, Math.PI * 2, true);
        context.clip();
        context.closePath();
        context.restore();
        return tempFileCanvas;
    }

    function colorize(img, r, g, b, a) {
        if (!img || !img.width)
            return img;

        var tempFileCanvas = document.createElement("canvas");

        tempFileCanvas.width = img.width;
        tempFileCanvas.height = img.height;

        var imgCtx = tempFileCanvas.getContext("2d"),
            imgData, i;
        imgCtx.drawImage(img, 0, 0);

        imgData = imgCtx.getImageData(0, 0, img.width, img.height);

        i = imgData.data.length;
        while((i -= 4) > -1) {
            imgData.data[i + 3] = imgData.data[i] * a;
            if (imgData.data[i + 3]) {
                imgData.data[i] = r;
                imgData.data[i + 1] = g;
                imgData.data[i + 2] = b;
            }
        }

        imgCtx.putImageData(imgData, 0, 0);
        return tempFileCanvas;
    }

    function render(){
        requestAnimationFrame(render);

        _calcStyle();

        context.save();
        context.clearRect(0, 0, that.width, that.height);

        _refreshCanvas();

        context.drawImage(bufCanvas, 0, 0);
        context.restore();
    }

    function _calcStyle(){
        nodes.filter(function(d) {
            return (d.visible || d.opacity);
        }).forEach(function(d){
            //半径
            if (d._toradius_begin){
                var currenttime = new Date().getTime() - d._toradius_begin_time;
                d.radius = jk.easing[d._toradius_type](null, currenttime, d._toradius_start_value, d._toradius_end_value, d._toradius_total_time);
                if (currenttime >= d._toradius_total_time){
                    d._toradius_begin = false;
                }
            }
        });
    }

    function blink(d, aliveCheck) {
        if (!d.visible) return;

        d.flash = (d.flash -= that.rateFlash) > 0 ? d.flash : 0;

        !d.flash && aliveCheck
        && (d.alive = (d.alive-- > 0 ? d.alive : 0))
        ;

        d.opacity = !d.alive
            ? ((d.opacity -= d.opacitySpeed) > 0 ? d.opacity : 0)
            : d.opacity
        ;

        d.visible && !d.opacity
        && (d.visible = false);

        if (d.visible == false){
            if (d.hideCallback){
                for (var i = 0; i < d.hideCallback.length; i++) {
                    d.hideCallback[i].call(d);
                }
            }
        }

        if (d.paths) {
            d.pathLife = (d.pathLife || 0);
            if (d.pathLife++ > 0) {
                d.pathLife = 0;
                if (d.paths.length) {
                    if (d.flash)
                        d.paths.shift();
                    else {
                        d.paths.shift();
                        d.paths.shift();
                        d.paths.shift();
                    }
                }
            }
        }
    }

    var _worker = null;

    this._loop = function() {
        render();
    }

    this._drawNode = function(d, xc) {
        d = $.extend({}, d);
        d.x = this.width * Math.random();
        d.y = this.height * Math.random();
        d.paths = [];
        d.opacity = 100;
        d.flash = 100;
        d.visible = true;
        d.imagefile = new Image();
        d.imagefile.src = d.image || "../../resource/particle.png";
        d.opacitySpeed = 0.5;

        if (d.pid && d.type == 'small'){
            nodes.filter(function(t){
                if (t.type == 'big'){
                    if (t.id == d.pid){
                        t.opacity = 100;
                        t.flash = 100;
                        t.visible = true;
                        t.alive = 200;
                        return true;
                    }
                }
            })[0];

            d.radius = d.radius || 15;
            if (d.drawtail === false){
                d.drawtail = false;
            }else{
                d.drawtail = d.image ? false : true;
            }

            d.alive = this.nodeLife;
        }else{
            d.radius = d.radius || 20;
            d.alive = 200;
        }

        d.color = d.color || extColor(Math.floor(Math.random()*20));
        d.rgb = d3.rgb(d.color);

        //============bind function============
        d.hide = function(during, type, cb){
            _hideNode(d, during, type, cb);
        }

        d.bigger = function(radius, during, type){
            var during = during || 1000;
            d._toradius_start_value = d.radius;
            d._toradius_end_value = radius - d.radius;
            d._toradius_begin_time = new Date().getTime();
            d._toradius_total_time = during;
            d._toradius_type = type || 'easeOutBounce';
            d._toradius_begin = true;
            // _restart();
        }

        d.imagefile.onload = function(){
            nodes.push(d);
            _restart();
        };

        d.imagefile.onerror = function(){
            d.imagefile = null;
            d.image = null;
            nodes.push(d);
            _restart();
        }
    }

    function _hideNode(d, during, callback){
        if (!during){
            d.immortal = false;
            d.opacity = 0;
            d.alive = 0;
        }else{
            d.immortal = false;
            d.opacitySpeed = 100 / during * 17;
            d.opacity = 100;
            d.alive = 0;
            d.tofar = true;
        }
        if (!d.hideCallback) d.hideCallback = [];
        if (callback) d.hideCallback.push(callback);
        _restart();
    }

    function _restart(){
        _force.nodes(nodes.filter(function(d) {
            return d.type == 'small' && (d.visible || d.opacity);
        })).start();

        _forceAuthor.nodes(nodes.filter(function(d) {
            return d.type == 'big' && (d.visible || d.opacity);
        })).start();
    }

    this._restart = _restart;

    canvas.addEventListener('mousemove', function(e) {
        var offset = $(context.canvas).offset();
        var mx = e.clientX - offset.left;
        var my = e.clientY - offset.top;
        var hasonehover = false;
        var hasonedrag = false;
        nodes.forEach(function(d){
            if (d._isdraging){
                _isdraging = true;
                d.x = d._dragx + (mx - d._mousex) / lastEvent.scale;
                d.y = d._dragy + (my - d._mousey) / lastEvent.scale;
                d.px = d.x;
                d.py = d.y;
                hasonedrag = true;
                return;
            }
            var cx = d.x * lastEvent.scale + lastEvent.translate[0],
                cy = d.y * lastEvent.scale + lastEvent.translate[1],
                cr = d.radius * lastEvent.scale;
            if ((mx-cx)*(mx-cx)+(my-cy)*(my-cy) < cr*cr){
                hasonehover = true;
                context.canvas.style.cursor = 'pointer';
                d.onhover = true;
                that.onmouseover(d);
            }else{
                if (d.onhover){
                    that.onmouseout(d);
                }
                d.onhover = false;
            }
        });
        if (hasonedrag){
            canvas.removeEventListener('click', clicktmp);
        }
        if (!hasonehover){
            context.canvas.style.cursor = 'auto';
        }
    });

    var clicktmp = function(e){
        var offset = $(context.canvas).offset();
        var mx = e.clientX - offset.left;
        var my = e.clientY - offset.top;

        var hasonetrigger = false;

        nodes.forEach(function(d){
            var cx = d.x * lastEvent.scale + lastEvent.translate[0],
                cy = d.y * lastEvent.scale + lastEvent.translate[1],
                cr = d.radius * lastEvent.scale;

            if ((mx-cx)*(mx-cx)+(my-cy)*(my-cy) < cr*cr){
                hasonetrigger = true;
                context.canvas.style.cursor = 'pointer';
                that.onclick(d);
            }
        });
        if (!hasonetrigger){
            context.canvas.style.cursor = 'auto';
        }
    };


    canvas.addEventListener('click', clicktmp);
    var _lastEvent = {};

    canvas.addEventListener('mousedown', function(e){
        var offset = $(context.canvas).offset();
        var mx = e.clientX - offset.left;
        var my = e.clientY - offset.top;
        nodes.forEach(function(d){
            var cx = d.x * lastEvent.scale + lastEvent.translate[0],
                cy = d.y * lastEvent.scale + lastEvent.translate[1],
                cr = d.radius * lastEvent.scale;
            if ((mx-cx)*(mx-cx)+(my-cy)*(my-cy) < cr*cr){
                d._isdraging = true;
                d._mousex = mx;
                d._mousey = my;
                d._dragx = d.x;
                d._dragy = d.y;
                d.fixed = true;
            }
        });
    });

    canvas.addEventListener('mouseup', function(e){
        var flag = false;
        nodes.forEach(function(d){
            if (d._isdraging){
                flag = true;
                d._isdraging = false;
                d.fixed = false;
            }
        });
        if (flag) {
            setTimeout(function() {
                canvas.addEventListener('click', clicktmp);
            }, 10);
            zoom.translate(_lastEvent.translate);
        }
        _isdraging = false;
    });

}

var Console = function(options){
    this.target = $(options.id);
    this.data = options.data || [];
    this._data = [];
    this.showmax = options.showmax || 20;
}

Console.prototype = {
    init: function() {
        this._render_init();
        this.add();
    },
    _render_init: function(){
        var that = this;
        this._table = $("<table></table>");
        var console_box_control = $('<a href="#" class="toggle" data-target="#console-table-container"><div class="table-header"><h1 class="table-header"><span class="icon-open"></span>OPEN / CLOSE</h1></div></a>').click(function(){
            that._table.toggle();
        });
        var console_box = $("<div id='console' class='box gray-bg'></div>").append(console_box_control).append(this._table);
        this.console = console_box;
        this.target.append(console_box);
    },
    render: function(){
        this._table.empty();
        for (var i in this._data){
            var trd = this._data[i];

            var index = 0;

            var tr = $("<tr></tr>").css({color: trd._color || 'white', width: w});
            for (var j in trd){
                index++;
                if (index == 1){
                    var w = 70;
                }else if (index == 2){
                    var w = 30;
                }else{
                    var w = 200;
                }

                if (j[0] != '_'){
                    if (j == 'content' && trd._node && trd._node.url){
                        tr.append("<td style='width:"+w+"px'><a style='color:"+trd._color+"' target='_blank' href='"+trd._node.url+"'>"+trd[j]+"</a></td>");
                    }else{
                        tr.append("<td style='width:"+w+"px'>"+trd[j]+"</td>");
                    }
                }
            }
            this._table.append(tr);
            if (this.console.scrollTop() + this.console.height() < this._table.height() - 50){
                return;
            }
            this.console.scrollTop(this._table.height());
        }
    },
    add: function(obj){
        if (obj) this.data.push(obj);
        var s = this.data.length - this.showmax;
        if (s<0) s = 0;
        this._data = this.data.slice(s);
        this.render();
    }
}

Canvas.prototype = {
    init: function() {
        this._loop();
        this.cs = new Console({
        	id: this.id
        });
        this.cs.init();
    },
    restart: function(){
        this._restart();
    },
    play: function(){
        this._pause = false;
    },
    pause: function(){
        this._pause = true;
    },
    /**
     * 画布中添加一个点
     * id       int     nodeid
     * pid      int     parentid
     * type     string  'small' or 'big'
     * radius   int
     * color    string
     * title    string
     * content  string
     * image    string
     * node     obj     nodedata
     */
    addNode: function(obj) {
        this._drawNode(obj);

        var color = obj.color;
        if (obj.type == 'small'){
            jk.utils.filter(this.nodes, 'pid', obj.pid, function(o){
                color = o.color;
            });
        }

        this.cs.add({
        	time: obj.node.date,
        	type: obj.type == 'big' ? '话题' : '事件',
        	content: obj.content,
                   _color: color,
                   _node: obj.node
        });
    },
    /**
     * 获取画布中的结点
     */
    getNodes: function(){
        return this.nodes;
    }
}