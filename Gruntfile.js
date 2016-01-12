module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options:{
          sourcemap: 'auto'
        },
        files: {
          'css/style.css': 'css/sass/style.scss',
        }
      }
    },
    //
    postcss: {
      modern: {
        options: {
          processors: [
            require('autoprefixer-core')({browsers: 'last 2 versions'}),
            require('cssnano')({
              reduceIdents:false,
              mergeIdents:false,
              mergeRules:false
            })
          ]
        },
        src: 'css/style.css',
        dest: 'css/style.min.css'
      }
      // removed Old-IE PostCSS
    },
    //
    watch: {
      css: {
        files: 'css/sass/*.scss',
        tasks: ['sass','postcss']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss'); // Postcss plugins - https://www.npmjs.com/search?q=postcss
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
};