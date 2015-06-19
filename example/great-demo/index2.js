$(function(){

    var DateFuc = {
        datebtwint : function(str1, str2){
            var int1 = parseInt(str1.substring(5, 7));
            var int2 = parseInt(str2.substring(5, 7));
            var k = int2 - int1;
            if (k<0) k+=12;
            return k;
        },
        inttodate : function(str, int1){
            var i = parseInt(str.substring(5, 7));
            var s = str.substring(0, 5);
            i += int1;
            if (i > 12){
                s = '201' + ((parseInt(s[3]) + Math.floor(i / 13)) + '') + '-';
                i %= 12;
                if (i == 0) i = 12;
            }
            if (i < 10)
                s += '0';
            s += i;
            return s;
        }
    }

    Date.prototype.getdate = function(){
        var year = this.getFullYear();
        var month = this.getMonth() + 1;
        if (month < 10) month = '0' + month;
        var day = this.getDate();
        if (day < 10) day = '0' + day;
        return year + '-' + month + '-' + day;
    }

    var beginTime = '2014-01';
    var endTime = '2014-12';
    window.curTime = '2014-11';
    var scolor = d3.scale.category20();
    var imagepath = './images2/';


    var drawPic = jk.drawChart({
        'type': 'CrCanvas',
        'option': {
            id: "#chart",
            friction: 0.6,
            category: true,
            charge: function(d) {
                return - ( 25 + d.radius ) * 5;
            },
            onclick: function(n){
                $(".upbtn").show();
                $(".btn1").hide();
                $(".btn2").show();
                var up = null;
                $(drawPic.canvas).fadeOut(1000, function(){
                    up = new UP("#chart", n.node, curTime);
                });
                $(".upbtn").click(function(){
                    up.remove(function(){
                        $(drawPic.canvas).fadeIn(1000);
                        $(".upbtn").hide();
                        $(".btn1").show();
                        $(".btn2").hide();
                    });
                });
            },
            onmouseover: function(d){
                if (d.type == 'small') return;
                if (window.tt_show) return;
                window.tt = new tooltip(d, {});
                tt.show();
                window.tt_show = true;
            },
            onmouseout: function(d){
                if (!window.tt_show) return;
                if (d.type == 'small') return;
                window.tt.hide();
                window.tt_show = false;
            }
        }
    });
    drawPic.init();
    var nodes = drawPic.getNodes();

    //====click====
    $(document).click(function(e){
        if ($(e.target).closest(".pngbtn").length) return;
        if ($(e.target).closest('.abpanel').length){
            return;
        }else{
            $(".abpanel").hide();
        }
    });

    $(".btn1").click(function(){
        var data = [];
        var x = ['x'];

        for (var i = 0; i<12; i++){
            var s = DateFuc.inttodate(beginTime, i);
            x.push(s);
        }
        data.push(x);

        for (var i = 0; i<resdata.length; i++){
            var t = [];
            t.push(resdata[i].name);

            for (var j = 1; j < x.length; j++){
                t.push(resdata[i].number[x[j]]);
            }
            data.push(t);
        }

        $("#chartpanel").show();

        chart = jk.drawChart({
            bindto: '#linechart',
            data: {
                x: 'x',
                columns: data
            },
            axis: {
                x: {
                    type: 'category'
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

    //====resdata====
    var resdata = [];

    var minSum = 1e10;
    var maxSum = 0;
    var minRadius = 20;
    var maxRadius = 50;
    var sNodesMax = 20;

    //====init====
    function initall(){
        _initSlides();

        loadtimedata(curTime, function(data){
            init(data);
        });
    }

    initall();

    //====init time====
    function loadtimedata(time, callback){
        var year = time.split('-')[0];
        var month = time.split('-')[1];

        //$.ajax({
        //    url:'http://222.29.197.240:8080/demo/HotPeople.jsp?year='+year+'&month='+month,
        //    dataType:"jsonp",
        //    jsonp:"callback",
        //    success:function(data){
        //        callback(data);
        //    }
        //});

        $.ajax({
            url:'http://localhost:8080/demojson/2014-12.json',
            dataType:"json",
            jsonp:"callback",
            success:function(data){
                console.log(data);
                callback(data);
            }
        });
    }

    //====init data====
    function init(data){
        resdata = [];
        maxSum = 0;
        minSum = 1e10;
        var person = {};
        for(var i = 0; i < data.length; i++){
            person = data[i];
            person.sum = 0;
            for (var j in person.number){
                person.sum += person.number[j];
            }
            if (person.sum > maxSum) maxSum = person.sum;
            if (person.sum < minSum) minSum = person.sum;

            resdata.push(person);
        }
        _updateCurTime(curTime);
    }

    //====init sildes====
    function _initSlides(){
        $("#rangevalue").text(curTime);
        $("#rangeinput").change(function(){
            var s = $(this).val();
            s = Math.floor(s / 100 * 12);

            var nowTime = DateFuc.inttodate(beginTime, s);

            if (nowTime != curTime){
                curTime = nowTime;
                loadtimedata(curTime, function(data){
                    init(data);
                });

                $("#rangevalue").show().text(curTime);
            }
        });
    };

    //====update cur time====
    function _updateCurTime(time){
        var ll = jj = kk = 0;
        //添加新的用户 更新已有的用户
        for(var i=0; i<resdata.length; i++){
            var obj = jk.chart.fn.filter(nodes, 'id', resdata[i].id);
            if (obj.length == 0){
                (function(i){
                    setTimeout(function() {
                        _addPerson(resdata[i], time);
                    }, ll * 500);
                })(i);

                ll++;
            }else{
                _updatePerson(obj[0], resdata[i]);
                jj++;
            }
        }
        //删除离开的用户
        var rmque = [];
        for (var i=0; i<nodes.length; i++){
            if (nodes[i].type != 'big') continue;
            var obj = jk.utils.filter(resdata, 'id', nodes[i].id);
            if (obj.length == 0){
                kk++;
                rmque.push(nodes[i]);
            }
        }
        _biganiQue2(rmque);
        console.log(ll, jj, kk);
    }

    //====add Nodes====
    function _addPerson(person, time){
        var r = (person.sum - minSum) / (maxSum - minSum) * ( maxRadius - minRadius ) + minRadius;
        var snodeslength = (person.sum - minSum) / (maxSum - minSum) * sNodesMax + 3;
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
            drawPic.addNode({
                node: person,
                id: person.id,
                radius: r,
                type: 'big',
                content: person.name,
                title: person.name,
                immortal: true,
                image: imgurl,
                color: scolor(person.id)
            });

            var que2 = [];
            for (var i=0; i<snodeslength; i++){
                que2.push({
                    node: {},
                    pid: person.id,
                    type: 'small',
                    content: i.title,
                    immortal: false,
                    color: 'white',
                    radius: 10,
                    _display: true
                });
            }
            _aniQue(que2);
        }
    }

    //====update nodes====
    function _updatePerson(node, data){
        var r = (data.sum - minSum) / (maxSum - minSum) * ( maxRadius - minRadius ) + minRadius;
        var snodeslength = (data.sum - minSum) / (maxSum - minSum) * sNodesMax + 3;
        node.bigger(r, 1000, 'swing');
        node.immortal = true;
        node.visible = true;
        node.opacity = 100;

        var lc = jk.utils.filter(nodes, 'pid', node.id);
        var pc = [];
        for (var i = 0; i < lc.length; i++){
            lc[i]._display = true;
            pc.push(lc[i]);
        }

        var que = [];
        if (pc.length < snodeslength){
            for (var i = 0; i < snodeslength - pc.length; i++){
                que.push({
                    node: {},
                    pid: node.id,
                    type: 'small',
                    content: '',
                    immortal: true,
                    color: 'white',
                    radius: 10,
                    _display: true
                });
            }
            _aniQue(que);
        }else{
            for (var i = 0; i < pc.length - snodeslength; i++){
                pc[i]._display = false;
                que.push(pc[i]);
            }
            _aniQue2(que);
        }
    }

    //====remove nodes====
    function _removePerson(node){
        jk.utils.filter(nodes, 'pid', node.id, function(d){
            d.hide(500);
        });
        node.hide(1000);
    }

    //====anique====
    function _aniQue(que){
        if (que.length > 0){
            setTimeout(function() {
                var k = que.pop();
                drawPic.addNode(k);
                _aniQue(que);
            }, 200 + Math.random() * 200);
        }
    }

    function _aniQue2(que){
        if (que.length > 0){
            setTimeout(function() {
                var k = que.pop();
                k.hide(1000);
                _aniQue2(que);
            }, 200 + Math.random() * 200);
        }
    }

    function _biganiQue(que){
        if (que.length > 0){
            setTimeout(function() {
                var k = que.pop();
                drawPic.addNode(k);
                _biganiQue(que);
            }, 200 + Math.random() * 200);
        }
    }

    function _biganiQue2(que){
        if (que.length > 0){
            setTimeout(function() {
                var k = que.pop();
                _removePerson(k);
                _biganiQue2(que);
            }, 200 + Math.random() * 200);
        }
    }

    //==== blink ====
    function smallnodeblink(){
        jk.chart.fn.filter(nodes, 'type', 'big', function(obj){
            if (obj.immortal == true && obj.alive > 0){
                nodes.forEach(function(i){
                    if (i.immortal == false && i.type == 'small' && i.pid == obj.id && i.opacity < 10 && i._display){
                        i.alive = Math.floor(Math.random()*10);
                        i.opacity = Math.floor(Math.random() * 80) + 20;
                        i.flash = 100;
                        i.visible = true;
                    }
                });
            }
        });
    }
    setInterval(function() {
        smallnodeblink();
    }, 100);

    //==== hover 小banner ====
    function tooltip(n, options){
        var data = n.node;
        var self = this;

        calcdata(data);

        function calcdata(d){
            var data = [];
            var x = ['x'];

            for (var i = 0; i<12; i++){
                var s = DateFuc.inttodate(beginTime, i);
                x.push(s);
            }
            data.push(x);

            var t = [];
            t.push(d.name);

            for (var j = 1; j < x.length; j++){
                t.push(d.number[x[j]]);
            }
            data.push(t);
            self.pdata = data;
        }

        this.draw = function(){
            var chart = jk.drawChart({
                bindto: '.chart_t',
                data: {
                    x: 'x',
                    columns: self.pdata
                },
                axis: {
                    x: {
                        type: 'category',
                        show: false
                    },
                    y: {
                        show: false
                    }
                }
            });
        }
    }
    tooltip.prototype = {
        show: function(){
            $(".little_banner").show();
            this.draw();
        },
        hide: function(){
            $(".little_banner .chart_t").empty();
            $(".little_banner").hide();
        }
    };
});