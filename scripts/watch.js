(function() {
    var dir = process.argv[2],
        watch = require('watch'),
        child_process = require('child_process'),
        q = require('q');
    
    watch.createMonitor(dir, monitor => {
        monitor.on("created", (f, stat) => {
            console.log('Created: ' + f);
            
            if(isJs(f) && !isSpec(f)) {
                handleJsEdit(f);
            } else if(isSass(f)) {
                handleSassEdit(f);
            } else if(isJade(f)) {
                handleJadeEdit(f);
            } else if(isImg(f)) {
                handleImgEdit(f);
            }
        });

        
        monitor.on("changed", (f, stat) => {
            console.log('Changed: ' + f);
            
            if(isJs(f) && !isSpec(f)) {
                handleJsEdit(f);
            } else if(isSass(f)) {
                handleSassEdit(f);
            } else if(isIndex(f)) {
                handleIndexEdit(f);
            } else if(isJade(f)) {
                handleJadeEdit(f);
            } else if(isImg(f)) {
                handleImgEdit(f);
            }
        });
        
        monitor.on("removed", (f, stat) => {
            console.log('Removed: ' + f);
        });
    });
    
    function isImg(f) {
        return f.indexOf('app\\assets\\images') > -1;
    }
    
    function isJs(f) {
        return f.substr(-3) === ".js";
    }
    
    function isSpec(f) {
        return f.substr(-8) === ".spec.js";
    }
    
    function isSass(f) {
        return f.substr(-5) === ".scss";
    }
    
    function isIndex(f) {
        return f === 'app\\index.jade';
    }
    
    function isJade(f) {
        return f.substr(-5) === ".jade";
    }
    
    function exec(cmd) {
        var deferred = q.defer();
        
        child_process.exec(cmd, e => {
            if(e) {
                deferred.reject(e);
            } else {
                deferred.resolve();
            }
        });
        
        return deferred.promise;
    }
    
    function handleImgEdit(f) {
        var adjustedPath = f.substring(4);
        exec(`npm run cp -- ${f} dev/${adjustedPath}`).then(() => {
            console.log("Success");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleJsEdit(f) {
        var adjustedPath = f.substring(4);
        exec(`npm run cp -- ${f} tmp\\js\\${adjustedPath} && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && node node_modules/parallelshell/index.js "npm run cp -- tmp/html/index.html dev/index.html" "npm run cp -- tmp\\js\\${adjustedPath} dev\\js\\${adjustedPath}"`).then(() => {
            console.log("Success");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleSassEdit(f) {
        var adjustedPath = f.substring(4),
            adjustedCssPath = f.substring(4, f.length - 5) + ".css",
            adjustedPathWithoutFileName = adjustedPath.substring(0, adjustedPath.lastIndexOf("\\"));
        exec(`npm run cp -- ${f} tmp\\sass\\${adjustedPath} && node node_modules/node-sass/bin/node-sass tmp/sass/${adjustedPath} -o tmp/css/${adjustedPathWithoutFileName} && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && node node_modules/parallelshell/index.js "npm run cp -- tmp/html/index.html dev/index.html" "npm run cp -- tmp\\css\\${adjustedCssPath} dev\\css\\${adjustedCssPath}`).then(() => {
           console.log("Success"); 
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleIndexEdit(f) {
        exec("npm run cp -- app/index.jade tmp/jade/index.jade && node node_modules/jade/bin/jade tmp/jade/index.jade && npm run mv -- tmp/jade/index.html tmp/html/index-no-dependencies.html -o && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && npm run cp -- tmp/html/index.html dev/index.html").then(() => {
            console.log("Success");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleJadeEdit(f) {
        var adjustedPath = f.substring(4),
            adjustedHtmlPath = f.substring(4, f.length - 5) + ".html",
            adjustedPathWithoutFileName = adjustedPath.substring(0, adjustedPath.lastIndexOf("\\"));
        exec(`npm run cp -- ${f} tmp/jade/${adjustedPath} && node node_modules/jade/bin/jade tmp/jade/${adjustedPath} -o tmp/html/${adjustedPathWithoutFileName} && npm run cp -- tmp/html/${adjustedHtmlPath} dev/html/${adjustedHtmlPath}`).then(() => {
            console.log("Success");
        }).catch(e => {
            console.log(e);
        });
    }
})();