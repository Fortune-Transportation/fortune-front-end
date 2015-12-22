(function() {
    var cpy = require('cpy'),
        exec = require('child_process').exec,
        files = process.argv,
        dest;
    
    files.splice(0, 2);
    dest = files.pop(files.length - 1, 1);

    cpy(files, dest, {nodir:true}, (e) => {
        if(e) {
            console.log(e);
        }
        process.exit(0); 
    });
})();