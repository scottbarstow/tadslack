"use strict";

module.exports = function (grunt) {

  var _ = grunt.util._;

  var sourceFiles = [ "*.js", "lib/**/*.js" ];
  var testFiles   = [ "test/**/*.js" ];
  var jsFiles    = sourceFiles.concat(testFiles);

  var lessFiles = "./lib/assets/less/**/*.less";

  var defaultJsHintOptions = grunt.file.readJSON("./.jshint.json");
  var testJsHintOptions = _.defaults(
    grunt.file.readJSON("./test/.jshint.json"),
    defaultJsHintOptions
  );

  grunt.initConfig({
    jscs : {
      src     : jsFiles,
      options : {
        config : ".jscsrc"
      }
    },

    jshint : {
      src     : sourceFiles,
      options : defaultJsHintOptions,
      test    : {
        options : testJsHintOptions,
        files   : {
          test : testFiles
        }
      }
    },

    mochaIstanbul : {
      coverage : {
        src     : "test",
        options : {
          check : {
            statements : 100,
            branches   : 100,
            lines      : 100,
            functions  : 100
          },

          recursive : true
        }
      }
    },

    watch : {
      static : {
        files : lessFiles,
        tasks : [ "less:default" ]
      }
    },

    less : {
      default : {
        files : {
          "./static/css/style.css" : "./lib/assets/less/style.less"
        }
      }
    },

    clean : [ "coverage" ]
  });

  // Load plugins
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks("grunt-mocha-istanbul");

  // Rename tasks
  grunt.task.renameTask("mocha_istanbul", "mochaIstanbul");

  // Register tasks
  grunt.registerTask("test", [ "mochaIstanbul:coverage" ]);
  grunt.registerTask("lint", "Check for common code problems.", [ "jshint" ]);
  grunt.registerTask("style", "Check for style conformity.", [ "jscs" ]);
  grunt.registerTask("default", [ "clean", "lint", "style", "test" ]);

};