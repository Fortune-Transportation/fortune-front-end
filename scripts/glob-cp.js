/*
Args: <fromGlobPattern> <to>
Options:
    -e: exclusion glob pattern(s)
*/
(function() {
    var minimist = require('minimist'),
        minimatch = require('minimatch'),
        globby = require('globby'),
        q = require('q'),
        fsExtra = require('fs-extra'),
        argv = minimist(process.argv.slice(2)),
        fromGlobPattern = argv._[0],
        root = getRoot(fromGlobPattern),
        to = argv._[1],
        excludeGlobPatterns = argv.e,
        numExcludes;
    
    if(!Array.isArray(excludeGlobPatterns)) {
        if(excludeGlobPatterns) {
            excludeGlobPatterns = [excludeGlobPatterns];
        } else {
            excludeGlobPatterns = [];
        }
    }
    numExcludes = excludeGlobPatterns.length
    
    for(var i = 0; i < numExcludes; i++) {
        excludeGlobPatterns[i] = `${process.cwd()}\\${excludeGlobPatterns[i]}`;
    }
    
    globby(fromGlobPattern).then(paths => {
        var promises = [],
            path, 
            dest;
        for(path of paths) {
            dest = getDestPath(root, path, to);
            promises.push(copy(path, dest));
        }
        return q.all(promises);
    }).then(() => {
        process.exit(0);
    }).catch(e => {
        console.log(e);
        process.exit(1);
    });
    
    function getRoot(globPattern) {
        var index = globPattern.search(/(\/|\\)\*/),
            root = "";
        if(index > -1) {
            root = globPattern.substring(0, index) + "/";
        }
        return root;
    }
    
    function getDestPath(root, from, to) {
        var dest = to;
        if(root.length > 0) {
            dest = dest + "/" + from.substring(root.length);
        }
        return dest;
    }
    
    function copy(from, to) {
        var deferred = q.defer();
        fsExtra.copy(
            from,
            to,
            {filter: filter,clobber: true},
            e => {
                if(e) {
                    deferred.reject(e);
                } else {
                    deferred.resolve();
                }
            }
        );
        
        return deferred.promise;
    }
    
    function filter(value) {
        var includePath = true,
            numExcludes = excludeGlobPatterns.length;
        for(var i = 0; i < numExcludes && includePath; i++) {
            includePath = !minimatch(value, excludeGlobPatterns[i]);
        }
        return includePath;
    }
})();