var express = require('express');
var router = express.Router();
var fs = require('fs');
var ss = require('stream-stream');
var Readable = require('stream').Readable;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/preview', function(req, res){
  res.render('preview');
});

router.post('/generate', function(req, res) {
  var data = req.body.config;

    _generateJsCode(data);
    _generateCssCode();

  res.status(200).send({
      content: 'helloworld!'
  });
});


function _generateJsCode(config){
    var head = fs.createReadStream('./public/chartbone_base/head.jstpl');
    var footer = fs.createReadStream('./public/chartbone_base/footer.jstpl');
    var appcharts = fs.createReadStream('./public/chartbone_base/appcharts.jstpl');

    var writeStream = fs.createWriteStream('./public/chartbone/core.js');


    var steam = ss();
    steam.write(head);

    //create config
    var configstr = 'window.config = ' + JSON.stringify(config) + ';\n\n';
    steam.write(_createReadableStream(configstr));

    steam.write(appcharts);
    steam.write(footer);
    steam.end();
    steam.pipe(writeStream);
}

function _generateCssCode(){
    var index = fs.createReadStream('./public/chartbone_base/index.css');
    var markdown = fs.createReadStream('./public/chartbone_base/markdown.css');
    var writeStream = fs.createWriteStream('./public/chartbone/core.css');

    var steam = ss();
    steam.write(index);
    steam.write(markdown);
    steam.end();
    steam.pipe(writeStream);
}


function _createReadableStream(data){
    var s = new Readable;
    if (typeof data == 'string'){
        s.push(data);
    }else{
        s.push(JSON.stringify(data));
    }
    s.push(null);
    return s;
}


module.exports = router;