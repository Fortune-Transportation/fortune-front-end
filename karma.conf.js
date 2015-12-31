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
        singleRun: true,
        browsers: ['Firefox']
    };
    
    config.set(configuration);
}
