/*
Arguments: <type> <srcGlobPatters> <output>
Possible types: js, css
*/
(function() {
    var globby = require("globby"),
        uglifyCss = require("uglifycss"),
        uglifyJs = require("uglify-js"),
        fsExtra = require("fs-extra"),
        q = require("q"),
        argv = process.argv.slice(2),
        type = argv.shift(),
        outputPath = argv.pop(),
        globPatterns = argv;
    
    validateType(type);

    reorderGlobPatterns(globPatterns);
    
    globby(globPatterns).then(files => {
        var promise;
        if(type === "js") {
            promise = uglifyJs.minify(files).code;
        } else {
            promise = uglifyCss.processFiles(files);
        }
        return promise;
    }).then(content => {
        return writeFile(outputPath, content);
    }).then(() => {
        process.exit(0);
    }).catch(e => {
        console.log(e);
        process.exit(1);
    });
    
    // Ensures exclusion glob patterns are last
    function reorderGlobPatterns(globPatterns) {
        var numGlobPatterns = globPatterns.length,
            globPattern;
        for(var i = 0; i < numGlobPatterns; i++) {
            globPattern = globPatterns[i];
            if(globPattern.charAt(0) === '!') {
                globPatterns.splice(i,1);
                globPatterns.push(globPattern);
            }
        }
    }
    
    // Ensures type is js or css
    function validateType(type) {
        if(type !== "js" && type !== "css") {
            throw new Error(`Type "${type}" is not supported.`);
        }
    }
    
    // Ensures parent directory exists before
    // writing to file
    function writeFile(dest, content) {
        var deferred = q.defer();
        
        fsExtra.outputFile(dest, content, e => {
            if(e) {
                deferred.reject(e);
            } else {
                deferred.resolve();
            }
        });
        
        return deferred.promise;
    }
})();