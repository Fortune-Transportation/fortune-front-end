(function() {
    var globby = require("globby"),
        uglify = require("uglifycss"),
        fsp = require("fs-promise"),
        q = require("q");

    var outputFile = process.argv[2],
        outputDir = outputFile.substring(0,outputFile.replace('\\','/').lastIndexOf('/'));
        globPatterns = process.argv;
    globPatterns.splice(0,3);
    reorderGlobPatterns(globPatterns);
    
    mkdir(outputDir).then(function() {
        fsp.exists(outputDir).then(exists => {
        });
        return globby(globPatterns);
    }).then(files => {
        return uglify.processFiles(files);
    }).then(content => {
        return fsp.writeFile(outputFile, content);
    }).then(function() {
        process.exit(0);
    }).catch(function(e) {
        console.log(e);
        process.exit(1);
    });
    
    // Creates directory if it does not
    // already exist
    function mkdir(dir) {
        var deferred = q.defer();
        fsp.exists(dir).then(exists => {
            if(exists) {
                deferred.resolve();
            } else {
                fsp.mkdir(dir).then(function() {
                    deferred.resolve();
                }).catch(e => {
                    throw e;
                });
            }
        }).catch(e => {
            deferred.reject(e);
        })
        return deferred.promise;
    }
    
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
})();