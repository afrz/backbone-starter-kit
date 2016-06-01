module.exports = config:
  paths:
    public: '../public'
  files:
    javascripts: joinTo:
      'build/lib.js': /^bower_components|^vendor/
      'build/app.js': /^app/
    stylesheets: joinTo:
      'build/lib.css': /^bower_components|^vendor/
      'build/app.css': /^app/
    templates:
      joinTo: 'build/app.js'
