

var customstdout = require('./stdoutStorage.js');

// code for stdout redirect to Azure Storage is here : https://github.com/khenidak/node-stdout-AzureStorage 

var options = {
    'ByteBufferSize' : 1024, // buffer in mem for xxx then write the entire buffer (one call) to azure storage. ( can not exceed 3 meg, check StorageStreamWriter Constants).
    'ByteFileSize'   : 1024 * 1024 * 10, // each file size (max 100 megs, to allow easy download of logs, note append blob can take more data). 
    'AccountName'    : 'account', // your storage acocunt
    'ContainerName'  : 'container', // the target container (must be created prior)
    'BlobNamePrefix' : 'i-', // the component overflow to new files (and create them) it will use this prefix.
    'StorageKey'     : 'storage-key' // storage key
};



// stdout is redirected to azure append blob
customstdout.hook(options);

console.log("Setting up interval."); 

setInterval(function(){
// Magic here 
console.log("Working " + new Date().toISOString()); 

},5000)

console.logImmediate('this is will bypass the in-memory buffer and go straight to Azure Storage', function(){/* Magic here  */});

// beforeExit is called on graceful exit, you are allowed 
// to perform async operations. 
process.on('beforeExit', function () {
    customstdout.unhook(function () { 
        console.log('unhook is done')
    });
})
