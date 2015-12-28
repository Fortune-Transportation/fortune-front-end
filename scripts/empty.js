(function() {
    var fsExtra = require('fs-extra'),
        path = process.argv[2];
    
    fsExtra.emptyDir(path, e => {
        if(e) {
            console.log(e);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
})();