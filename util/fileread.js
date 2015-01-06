var fs = require('fs');

var readFile =  function(filePath, callback ){
    fs.readFile(filePath, function(error, content) {
        var statusCode;
        if(content){
            callback(null, {
                "data" : content
            });
        }
        else{
            callback({
                "msg":"Error in reading from file",
                "error":error
            }, null);
        }

    });

}

module.exports = readFile;