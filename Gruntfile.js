module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    requirejs: {
      buildDev: {
        options: {
          baseUrl: 'src',
          skipModuleInsertion: true,
          include: [
            'Keynavigator.js',
            'Cellfactory.js',
            'Celltable.js'
          ],
          out: 'keynavigator.js',
          optimize: 'none',
          wrap: {
            startFile: 'wrap/start.frag',
            endFile: 'wrap/end.frag'
          }
        }
      },

      build: {
        options: {
          baseUrl: 'src',
          skipModuleInsertion: true,
          include: [
            'Keynavigator.js',
            'Cellfactory.js',
            'Celltable.js'
          ],
          out: 'keynavigator-min.js',
          optimize: 'uglify',
          wrap: {
            startFile: 'wrap/start.frag',
            endFile: 'wrap/end.frag'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('default', ['requirejs:buildDev', 'requirejs:build']);
};
