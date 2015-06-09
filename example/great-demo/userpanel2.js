function UP(target, person){
    var imagepath = "./images2/";
    person.id = 27362;

    var dc = jk.drawChart({
        type: 'CrCanvas',
        option: {
            id: target,
            pathLength: 200,
            onclick: function(d){
                $(".loading").show();
                $.ajax({
                    url:'http://222.29.197.240:8080/demo/Events.jsp?id_1='+person.id+'&id_2='+d.id+'&time='+curTime,
                    dataType:"jsonp",
                    jsonp:"callback",
                    success:function(data){
                        $(".loading").hide();
                        drawEvents(data);
                    }
                });
            },
            onmouseover: function(d){
                if (d.type == 'big') return;
                d.bigger(30, 500, 'swing');
                d.drawpath = true;
            },
            onmouseout: function(d){
                if (d.type == 'big') return;
                d.bigger(10, 500, 'swing');
                d.drawpath = false;
            }
        }
    });
    dc.init();
    $(dc.canvas).hide().fadeIn(1000);

    var mr = 50;
    var mir = 10;
    var ct = window.curTime;
    var nodes = dc.getNodes();

    $.ajax({
        //url:'http://222.29.197.240:8080/demo/PersonInfo.jsp?id='+person.id,
        //dataType:"jsonp",
        url:'http://222.29.197.235/example/great-demo/demojson/27362.json',
        dataType:"json",
        jsonp:"callback",
        success:function(data){
            person = data;
            var relations = data.data[ct].relation;
            for (var i = 0; i<relations.length; i++){
                _addsmallnode(relations[i]);
            }
        }
    });

    $(".little_banner").hide();

    console.log(person);

    function drawEvents(plist){
        $("#eventpanel").show();
        $("#eventlist").empty();

        var html = template("eventListTpl", {list: plist});
        $(".abpanel #eventlist").append(html);
    }

    $(".btn2").unbind('click').click(function(){
        var data = [];
        var x = ['x'];

        var p = _sort(person.data);

        for (var i = 0; i<p.length; i++){
            x.push(p[i].key);
        }

        data.push(x);

        var t = [];
        t.push(person.name);

        for (var j = 1; j < x.length; j++){
            var s = 0;
            for (var k in p[j-1].data.number){
                s+= parseInt(p[j-1].data.number[k]);
            }
            t.push(s);
        }
        data.push(t);

        $("#chartpanel").show();

        chart = jk.drawChart({
            bindto: '#linechart',
            data: {
                x: 'x',
                columns: data
            },
            axis: {
                x: {
                    type: 'category',
                },
                y: {
                    show: false
                }
            },
            subchart: {
                show: true
            },
            zoom: {
                enabled: true
            }
        });
    });

    $("#rangeinput").on("change", function(){
        if (window.curTime == ct) return;
        ct = window.curTime;
        var rs = person.data[ct].relation;

        var bcz = [];
        var cz = [];

        for (var i = 0; i < nodes.length; i++){
            if (nodes[i].alive > 0 && nodes[i].type == 'small'){
                var n = jk.chart.fn.filter(rs, 'id', nodes[i].id);
                if (!n || n.length == 0){
                    nodes[i].hide(1000);
                }
            }
        }

        for (var i = 0; i < rs.length; i++){
            var n = jk.chart.fn.filter(nodes, 'id', rs[i].id);
            if (n.length == 1){
                _updatesmallnode(n[0], rs[i]);
            }
            else{
                _addsmallnode(rs[i]);
            }
        }

    });


    var image = new Image();
    var imgurl = imagepath + person.id + '.png';
    image.src = imgurl;
    image.onload = function(){
        cx();
    }
    image.onerror = function(){
        imgurl = imagepath + 'default.jpg';
        cx();
    }

    function cx(){
        dc.addNode({
            node: person,
            id: person.id,
            radius: mr,
            type: 'big',
            content: person.name,
            title: person.name,
            immortal: true,
            image: imgurl
        });
    }


    function _addsmallnode(r){
        var data = {
            id: r.id,
            pid: person.id,
            type: 'small',
            title: r.name,
            radius: mir,
            image: imagepath + r.id +'.png',
            distance: calcdistance(r.similarity),
            drawpath: false,
            immortal: true,
            showtitle: true
        };

        var color = ['green', 'red'];
        var index = Math.floor(Math.random()*2);
        data.pathcolor = color[index];
        data.pathtext = r.keywords;
        //data.pathweight = Math.ceil(Math.random()*10);

        (function(pd){
            var image = new Image();
            image.src = imagepath + r.id +'.png',
                image.onload = function(){
                    dc.addNode(pd);
                }
            image.onerror = function(){
                pd.image = imagepath + 'default.jpg';

                var i = new Image();
                i.src = pd.image;
                i.onload = function(){
                    dc.addNode(pd);
                }
            }
        })(data);
    }

    function _updatesmallnode(node, data){
        node.distance = calcdistance(data.similarity);
    }

    function calcdistance(s){
        var res = s;
        if (res > 0.7) return 0.1;
        if (res > 0.6) return 0.6;
        if (res > 0.5) return 1.1;
        return 1.6;
    }

    this.remove = function(cb){
        $(dc.canvas).fadeOut(1000, function(){
            $(dc.canvas).remove();
            cb();
        });
    }

    function _sort(ary){
        var data = [];
        for (var i in ary){
            data.push({key:i, data: ary[i]});
        }
        for (var i = 0; i<data.length; i++)
            for (var j = i+1; j<data.length; j++)
                if (data[i].key > data[j].key){
                    var t = data[i];
                    data[i] = data[j];
                    data[j] = t;
                }
        return data;
    }
}