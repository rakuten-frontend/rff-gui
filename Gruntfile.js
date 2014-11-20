'use strict';

module.exports = function (grunt) {

  var path = require('path');

  var config = {
    path: {
      src: 'app',
      dist: 'dist/app',
      buildcontrol: 'dist'
    }
  };

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    config: config,

    clean: {
      dist: ['<%= config.path.dist %>/**'],
      tmp: ['.tmp/**']
    },

    watch: {
      sass: {
        files: ['<%= config.path.src %>/assets/styles/**/*.scss'],
        tasks: ['sass', 'autoprefixer']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      app: {
        files: [
          {
            src: ['<%= config.path.src %>/assets/scripts/**']
          }
        ]
      },
      grunt: {
        files: [
          {
            src: ['Gruntfile.js']
          }
        ]
      }
    },

    sass: {
      compile: {
        options: {
          style: 'expanded'
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.path.src %>/assets/styles',
            dest: '<%= config.path.src %>/assets/styles',
            src: [
              '**/*.scss',
              '!**/_*.scss'
            ],
            ext: '.css'
          }
        ]
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'Chrome >= 30'
        ]
      },
      compile: {
        files: [
          {
            expand: true,
            cwd: '<%= config.path.src %>/assets/styles',
            dest: '<%= config.path.src %>/assets/styles',
            src: ['*.css']
          }
        ]
      }
    },

    copy: {
      app: {
        options: {
          mode: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.path.src %>',
            dest: '<%= config.path.dist %>',
            src: [
              '**',
              '!package.json',
              '!assets/styles/**',
              '!assets/scripts/**',
              'assets/scripts/config/*',
              '!assets/vendor/**',
              'assets/vendor/bootstrap-sass-official/fonts/*',
              '!bower_components/**',
              '!node-webkit.app/**',
              '!nw.exe',
              '!nw.pak',
              '!*.dll'
            ],
            rename: function (dest, src) {
              if (src === 'package-release.json') {
                return path.join(dest, 'package.json');
              }
              return path.join(dest, src);
            },
            filter: 'isFile',
            dot: false
          }
        ]
      }
    },

    useminPrepare: {
      options: {
        root: '<%= config.path.src %>',
        dest: '<%= config.path.dist %>'
      },
      html: ['<%= config.path.dist %>/*.html']
    },

    usemin: {
      options: {
        assetsDirs: [
          '<%= config.path.dist %>'
        ]
      },
      html: {
        files: [{
          src: ['<%= config.path.dist %>/*.html']
        }]
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      }
    },

    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/assets/scripts',
            dest: '.tmp/concat/assets/scripts',
            src: ['*.js']
          }
        ]
      }
    }

  });

  grunt.registerTask('lint', [
    'newer:jshint'
  ]);

  grunt.registerTask('build', [
    'lint',
    'sass',
    'autoprefixer',
    'clean:dist',
    'clean:tmp',
    'copy:app',
    'useminPrepare',
    'concat',
    'cssmin',
    'ngmin',
    'uglify',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'lint',
    'build'
  ]);

};
