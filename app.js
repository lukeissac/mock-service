var http = require('http');
var path = require('path');
var config = require('./config/config.json');
var environmentGiven = process.env.NODE_ENV;
var envConfig = require('./config/app-'+environmentGiven+'.json')

var readFile = require('./util/fileread.js');

http.createServer(function (request, response) {

    if(request.url !== '/favicon.ico'){

        console.log('request initiated ignoring favicon...');

        var splittedUrl = request.url.split("?");
        var pathArray = splittedUrl[0].split("/");

        if( splittedUrl[1] !== undefined ){
            var paramArray = splittedUrl[1].split("&");
        }

        var productId;
        var filePath;
        var msg = "Wrong path given in url as corresponding file path is not found";

        var apiType = pathArray[2];


        if(config[apiType]){
           var uniqueIdentifier = config[apiType].uniqueIdentifier;
        }else{
           var uniqueIdentifier = "none";
        }

        if( uniqueIdentifier !== "none" ){
            paramArray.forEach(function(value, index){
                var paramKeyValArray = value.split("=");
                if(paramKeyValArray[0] == uniqueIdentifier ){
                    productId=paramKeyValArray[1];
                }

            });

            if(productId == undefined){
               msg = "Parameter missing or incorrect parameter key";
               filePath = envConfig.path+splittedUrl[0]+'/'+productId;
            }else{
               filePath = envConfig.path+splittedUrl[0]+'/'+productId;
            }


        }else{
            filePath = './' + request.url;
            if (filePath == './')
                filePath = './default.txt';
            else{
                filePath = envConfig.path+request.url;
            }

        }



         console.log(filePath);

       /* console.log(filePath);
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

        }*/


        path.exists(filePath, function(exists) {
            if (exists){

                readFile(filePath+'/statuscode.txt', function(err, resp){
                    if(!err && resp){
                        statusCode = resp.data;

                        readFile(filePath+'/response.txt', function(err, resp){

                            if (err) {
                                response.writeHead(500);
                                response.end(err);
                            }
                            else{
                                response.writeHead(statusCode, { 'Content-Type': config[apiType].contentType });
                                console.log("Response Data", resp.data );
                                response.end(resp.data);
                            }
                        });
                    }
                })

            }
            else {
                response.writeHead(404);
                response.end(msg);
            }
        });

    }



}).listen(8101);
console.log('Server running at yourhost:8101/');