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
            
            if(isJs(f) && !isSpec(f)) {
                handleJsDelete(f);
            } else if(isSass(f)) {
                handleSassDelete(f);
            } else if(isJade(f)) {
                handleJadeDelete(f);
            } else if(isImg(f)) {
                handleImgDelete(f);
            }
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
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleJsEdit(f) {
        var adjustedPath = f.substring(4);
        exec(`npm run cp -- ${f} tmp\\js\\${adjustedPath} && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && node node_modules/parallelshell/index.js "npm run cp -- tmp/html/index.html dev/index.html" "npm run cp -- tmp\\js\\${adjustedPath} dev\\js\\${adjustedPath}"`).then(() => {
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleSassEdit(f) {
        var adjustedPath = f.substring(4),
            adjustedCssPath = f.substring(4, f.length - 5) + ".css",
            adjustedPathWithoutFileName = adjustedPath.substring(0, adjustedPath.lastIndexOf("\\"));
        exec(`npm run cp -- ${f} tmp\\sass\\${adjustedPath} && node node_modules/node-sass/bin/node-sass tmp/sass/${adjustedPath} -o tmp/css/${adjustedPathWithoutFileName} && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && node node_modules/parallelshell/index.js "npm run cp -- tmp/html/index.html dev/index.html" "npm run cp -- tmp\\css\\${adjustedCssPath} dev\\css\\${adjustedCssPath}`).then(() => {
           console.log("Updated Successfully"); 
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleIndexEdit(f) {
        exec("npm run cp -- app/index.jade tmp/jade/index.jade && node node_modules/jade/bin/jade tmp/jade/index.jade && npm run mv -- tmp/jade/index.html tmp/html/index-no-dependencies.html -o && node scripts/inject-live-reload-script.js tmp/html/index-no-dependencies.html 9090 && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && npm run cp -- tmp/html/index.html dev/index.html").then(() => {
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleJadeEdit(f) {
        var adjustedPath = f.substring(4),
            adjustedHtmlPath = f.substring(4, f.length - 5) + ".html",
            adjustedPathWithoutFileName = adjustedPath.substring(0, adjustedPath.lastIndexOf("\\"));
        exec(`npm run cp -- ${f} tmp/jade/${adjustedPath} && node node_modules/jade/bin/jade tmp/jade/${adjustedPath} -o tmp/html/${adjustedPathWithoutFileName} && npm run cp -- tmp/html/${adjustedHtmlPath} dev/html/${adjustedHtmlPath}`).then(() => {
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleJsDelete(f) {
        var adjustedPath = f.substring(4);
        
        exec(`node node_modules/parallelshell/index.js "npm run rm -- tmp/js/${adjustedPath}" "npm run rm -- dev/js/${adjustedPath}" && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && npm run cp -- tmp/html/index.html dev/index.html`).then(() => {
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleSassDelete(f) {
        var adjustedPath = f.substring(4),
            adjustedCssPath = f.substring(4, f.length - 5) + ".css";
        
        exec(`node node_modules/parallelshell/index.js "npm run rm -- tmp/sass/${adjustedPath}" "npm run rm -- tmp/css/${adjustedCssPath}" "npm run rm -- dev/css/${adjustedCssPath}" && npm run cp -- tmp/html/index-no-dependencies.html tmp/html/index.html && npm run inject:js:dev && npm run inject:css:dev && npm run cp -- tmp/html/index.html dev/index.html`).then(() => {
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleJadeDelete(f) {
        var adjustedPath = f.substr(4),
            adjustedHtmlPath = f.substring(4, f.length - 5) + ".html";
        
        exec(`node node_modules/parallelshell/index.js "npm run rm -- tmp/jade/${adjustedPath}" "npm run rm -- tmp/html/${adjustedHtmlPath}" "npm run rm -- dev/html/${adjustedHtmlPath}"`).then(() => {
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
    
    function handleImgDelete(f) {
        var adjustedPath = f.substring(4);
        
        exec(`npm run rm -- dev/${adjustedPath}`).then(() => {
            console.log("Updated Successfully");
        }).catch(e => {
            console.log(e);
        });
    }
})();