//Protractor configuration file.
exports.config = {
    //seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
    capabilities: {
        'browserName': 'chrome'
    },
    framework: 'jasmine2',
    specs: ['e2e/**/*.spec.js'],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
