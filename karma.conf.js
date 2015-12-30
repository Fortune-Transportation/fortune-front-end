// Karma configuration
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'app/**/*.js',
      'app/**/*.spec.js'
    ],
    exclude: [
      'app/lib/**/*'
    ],
    reporters: ["progress"],
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true
  });
}
