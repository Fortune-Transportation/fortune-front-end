(function() {
    var fsExtra = require('fs-extra'),
        from = process.argv[2],
        to = process.argv[3];
    
    fsExtra.copy(from, to, e => {
        if(e) {
            console.log(e);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
})();