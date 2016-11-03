var express = require('express');
var os = require('os');
var app = express();
var http = require('http');

// Express, we want to serve content out of this directory
app.use(express.static(__dirname + '/content'));




app.get('/api/app', function(q,r){
    http.get({
                hostname: '10.0.0.9', // Azure internal load balancer ip
                port: 5001,           // LB rule configured on this port + backend Service on this port
                path: '/api/app'
    }, function (backendresponse)  {
        var body = '';
        backendresponse.on('data', function(chunk) {
            body += chunk;
        });
        backendresponse.on('end', function() {
            var o = JSON.parse(body);
                
            r.setHeader('content-type', 'application/json');
            r.send(JSON.stringify(
                    {

                        servername : os.hostname(),
                        backendresponse: o
                    }));
    
            });
        });
    });
// Listen and Serve
app.listen(9001);