// Protractor configuration
exports.config = {
    framework: 'jasmine2',
    specs: ['e2e/**/*.spec.js'],
    seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.48.2.jar",
    onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'none'}));
    },
    jasmineNodeOpts: {
        print: () => {}
    }
};