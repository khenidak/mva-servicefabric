var express = require('express');
var os = require('os');
var app = express();


// Express, we want to serve content out of this directory
app.use(express.static(__dirname + '/content'));


app.get('/api/app', function(q,r){
    r.setHeader('content-type', 'application/json');
    r.send(JSON.stringify({servername : os.hostname(), port : 5001}))
})
// Listen and Serve
app.listen(5001);