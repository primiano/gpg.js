var Module = {
  'noInitialRun': false,
  'arguments': GPGClient.arguments,
  'print': GPGClient.print, //function(text) { console.log('> ' + text); },
  'printErr': GPGClient.printErr, //function(text) { console.log('! ' + text); },
  'stdin': function() {
      if (Module.stdinPos === undefined)
        Module.stdinPos = 0;
      if (GPGClient.stdin === null || GPGClient.stdin === undefined)
        return null;
      var c = GPGClient.stdin.charCodeAt(Module.stdinPos++);
      c = isNaN(c) ? null : c;
      return c;
   },
   'onRuntimeReady': function() {
      Module.isRuntimeReady = true;
      Module.maybeCallMain();
   },
   'preInit': function() {
      console.log('Loading persistent FS');
      Module['isRuntimeReady'] = false;
      Module['isFSReady'] = false;
      Module['callActualMain'] = Module['callMain'];
      Module['callMain'] = Module['onRuntimeReady'];
      FS.mount(IDBFS, {}, '/home/web_user');
      FS.syncfs(true, function (err) {
        console.log('FS loaded, err=' + err);
        Module.isFSReady = true;
        Module.maybeCallMain();
      });
   },
   'maybeCallMain': function() {
      console.log('Maybe  ' +  Module.isRuntimeReady + ' '  + Module.isFSReady );
      if (Module.isRuntimeReady === true && Module.isFSReady === true) {
        Module.callActualMain(Module.arguments);
        console.log('Committing FS');
        FS.syncfs(function (err) {
         console.log('FS committed, err=' + err);
         GPGClient.terminate();
        });
      }
   },
};

