module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
        dist: {
            options: {
                // config: 'config.rb',
                httpPath : "plugins/contedit/plugin.files" ,
                cssDir : "plugins/contedit/plugin.files/resources/css/" ,
                sassDir : "src/sass/" ,
                imagesDir : "plugins/contedit/plugin.files/resources/img/" ,
                javascriptsDir : "plugins/contedit/plugin.files/resources/js/" ,
                cache : false ,  // .sass-cacheを出力するかどうか
                assetCacheBuster : "none" ,  // クエストにクエリ文字列付けてキャッシュ防ぐ
                sassOptions : { 'debug_info' : false } ,  // Sassファイルをブラウザで確認
                outputStyle : 'expanded' ,  // cssの主力形式 
                relativeAssets : true ,  // trueで相対パス、falseで絶対パス
                lineComments : false  // CSSファイルにSassファイルの何行目に記述されたものかを出力する
            }
        }
    },
    uglify: {
      build: {
        src: [
          'src/js/contConteditor.js',
          'src/js/*.js',
          'src/js/funcs/*.js'
        ],
        dest: 'plugins/contedit/plugin.files/resources/js/contConteditor.min.js'
      }
    },
    watch: {
      js: {
        files: '<%= uglify.build.src %>',
        tasks: ['uglify']
      } ,
      sass: {
          files: ['src/sass/contConteditor.scss'],
          tasks: ['compass'],
          options: {
              //変更されたらブラウザを更新
              livereload: false,
              nospawn: true
          }
      }
    }
  });


  // デフォルトのタスクを指定
  grunt.registerTask('default', ['watch']);

  // exec command
  // $ npm install
  // $ grunt
};
