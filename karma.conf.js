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
        reporters: ['spec'],
        autoWatch: false,
        singleRun: true,
        browsers: ['Firefox']
    };
    
    if(process.env.TRAVIS) {
        configuration.plugins = [
            'karma-coverage',
            'karma-jasmine',
            'karma-firefox-launcher',
            'karma-spec-reporter',
            'karma-coveralls'
        ];
        configuration.preprocessors = {
            '{app,app/!lib/**}/!(*.spec).js': 'coverage'
        };
        configuration.coverageReporter = {
            type: 'lcov',
            dir: 'coverage'
        };
        configuration.reporters.push('coverage');
        configuration.reporters.push('coveralls');
    }
    
    config.set(configuration);
}
