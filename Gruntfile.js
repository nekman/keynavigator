module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*! \n * \n * <%=pkg.description%>\n *\n * <%=pkg.url%> \n *\n *' +
              ' v<%=pkg.version%> - <%=grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT")%> \n */'
    },

    banner: '<%= meta.banner %>', // Optional Banner

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
