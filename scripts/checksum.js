(function() {
    var fsp = require("fs-promise"),
        q = require("q"),
        cs = require("checksum"),
        file = process.argv[2];
    
    checksum(file).then(sum => {
        var extIndex, newName;
        extIndex = file.lastIndexOf(".min.");
        if(extIndex === -1) {
            extIndex = file.lastIndexOf(".");
        }
        newName = file.substring(0, extIndex) +
            "." +
            sum +
            file.substring(extIndex, file.length);
        return fsp.rename(file, newName);
    }).then(function() {
        process.exit(0);
    }).catch(e => {
        console.log(e);
        process.exit(1);
    });
    
    function checksum(file) {
        var deferred = q.defer();
        cs.file(file, function(e, sum) {
           if(e) {
               deferred.reject(e);
           } else {
               deferred.resolve(sum);
           }
        });
        return deferred.promise;
    }
})();