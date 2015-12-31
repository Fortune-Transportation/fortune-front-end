// Karma configuration
module.exports = function(config) {
    var configuration = {
        frameworks: ['jasmine'],
        files: [
          'app/**/*.js',
          'app/**/*.spec.js'
        ],
        exclude: [
          'app/lib/**/*'
        ],
        reporters: ["spec"],
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: true,
        customLaunchers: {
          Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox', '--javascript-harmony']
          }
        }
    };
    
    if(process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }
    
    config.set(configuration);
}
