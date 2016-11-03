

var customstdout = require('./stdoutStorage.js');
var https = require('https'),                  
    fs =    require('fs');                     



// code for stdout redirect to Azure Storage is here : https://github.com/khenidak/node-stdout-AzureStorage 


var options = {
    'ByteBufferSize' : 1024, // buffer in mem for xxx then write the entire buffer (one call) to azure storage. ( can not exceed 3 meg, check StorageStreamWriter Constants).
    'ByteFileSize'   : 1024 * 1024 * 10, // each file size (max 100 megs, to allow easy download of logs, note append blob can take more data). 
    'AccountName'    : 'account', // your storage acocunt
    'ContainerName'  : 'container', // the target container (must be created prior)
    'BlobNamePrefix' : 'i-', // the component overflow to new files (and create them) it will use this prefix.
    'StorageKey'     : 'key' // storage key
};

/****************************** */

// stdout is redirected to azure append blob
customstdout.hook(options);

console.log("Setting up interval."); 

setInterval(function(){
// Magic here 
console.log("Working " + new Date().toISOString()); 
},5000)

console.logImmediate('this is will bypass the in-memory buffer and go straight to Azure Storage', function(){/* Magic here  */});


/*************************** */





var nReportCount = 1;
// reporting health 
setInterval(function (){
   
   // health report content
   var healthReport = JSON.stringify(
       {
         SourceId : "app2",
         Property: "State",
         HealthState : 1,
         Description: "node js app2 ComputeSvc health report number: " + nReportCount,
        TimeToLiveInMilliSeconds : 1000 * 5 * 60,
        SequenceNumber : nReportCount,
        RemoveWhenExpired: false
       }

   );


// you don't need certs for unsecure clusters
    // request options
    var options = {
        key:   fs.readFileSync('./private.key'), // private key to access SF REST  
        cert:  fs.readFileSync('./public.crt'),  // public key to access SF REST
        rejectUnauthorized: false,             
        host: "luxor.centralus.cloudapp.azure.com",                    
        port: 19080,                                  
        path : "/Applications/PortalApp/$/ReportHealth?api-version=1.0",
        method : "POST",
        headers : {
            'Content-Type' : 'application/json',
            'Content-Length' : Buffer.byteLength(healthReport)
        }
    };

    //http call
    var req =  https.request(options, function(response){ 
        console.log('health-report-http-statusCode: ', response.statusCode);
    });

    // post to upstream
    req.write(healthReport);

    // end it
    req.end();


    nReportCount++;
}, 
2000); // set Interval



/******************************/
// beforeExit is called on graceful exit, you are allowed 
// to perform async operations. 
process.on('beforeExit', function () {
    customstdout.unhook(function () { 
        console.log('unhook is done')
    });
})
