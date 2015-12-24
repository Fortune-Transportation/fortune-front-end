(function() {
    var path = process.argv[2],
        port = process.argv[3],
        fsp = require('fs-promise'),
        q = require('q');
    
    fsp.readFile(path, 'utf8').then(content => {
        var index = content.indexOf("</body>");
        content = `${content.substring(0,index)}<script src="http://localhost:${port}"></script>${content.substring(index)}`;
        return fsp.writeFile(path, content);
    }).then(() => {
        process.exit(0);
    }).catch(e => {
        console.log(e);
        process.exit(1);
    });
})();