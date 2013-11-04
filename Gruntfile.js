module.exports = function(grunt) {
  // プロジェクトの設定
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: 'plugins/contedit/data/resources/js_src/*.js',
        dest: 'plugins/contedit/data/resources/js/contConteditor.min.js'
      }
    },
    watch: {
      js: {
        files: '<%= uglify.build.src %>',
        tasks: ['uglify']
      }
    }
  });

  // プラグインのロードによって"uglify"タスクが提供されます。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // デフォルトのタスクを指定
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('default', ['watch']);

  // exec command
  // $ npm install
  // $ grunt
};
