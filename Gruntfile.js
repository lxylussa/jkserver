module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
        js: {
        options:{
          process: function(src, filepath){
            if (filepath != 'src/head.js' && filepath != 'src/tail.js'){
              var lines = [];
              src.split('\n').forEach(function(line){
                var sp = '';
                if (line.length > 0){
                  sp = '    ';
                }
                lines.push(sp+line);
              });
              src = lines.join('\n');
            }
            return src;
          }
        },
        src: [
          'resource/d3.min.js',
          'resource/c3.min.js',
          'src/head.js',
          'src/core.js',
          'src/config.js',
          'src/util.js',
          'src/animate.js',
          'src/easing.js',
          'src/circle-canvas.js',
          'src/tail.js'
        ],
        dest: 'chartbone2/public/resource/jk.js'
      },
        template: {
        src: [
          'chartbone/template/head.html',
          'chartbone/template/body.html',
          'chartbone/template/bar.html',
          'chartbone/template/line.html',
          'chartbone/template/pie.html',
          'chartbone/template/tool.html',
          'chartbone/template/cloud.html',
          'chartbone/template/footer.html'
        ],
        dest: 'chartbone/index.html'
      },
        js2: {
            options:{
                process: function(src, filepath){
                    if (filepath != 'src/head.js' && filepath != 'src/tail.js'){
                        var lines = [];
                        src.split('\n').forEach(function(line){
                            var sp = '';
                            if (line.length > 0){
                                sp = '    ';
                            }
                            lines.push(sp+line);
                        });
                        src = lines.join('\n');
                    }
                    return src;
                }
            },
            src: [
                'resource/d3.min.js',
                'resource/c3.min.js',
                'src/head.js',
                'src/core.js',
                'src/config.js',
                'src/util.js',
                'src/animate.js',
                'src/easing.js',
                'src/circle-canvas.js',
                'src/tail.js'
            ],
            dest: 'jk.js'
        }
    },
    jshint: {
      files: ['Gruntfile.js', 'jk.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      concat:{
        tasks: 'concat',
        files: ['src/*.js']
      },
      chartbone: {
        tasks: 'concat',
        files: ['chartbone/template/*.html']
      },
      client: {
        files: ['svgvscanvas/*','chartbone/*','example/demo2/*','example/demo3/*', 'jk.js'],
        options:{
          livereload: true
        }
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat','watch']);

};