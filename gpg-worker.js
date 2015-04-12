var GPGClient = {
  'arguments': [],
  'stdin': null,
  'print': function(msg) { postMessage({f: 'stdout', data: msg}); },
  'printErr': function(msg) { postMessage({f: 'stderr', data: msg}); },
  'terminate': function() { close(); }
 };


self.addEventListener('message', function(e) {
  if (e.data.cmd == undefined)
    return;
  switch (e.data.cmd) {
    case 'start':
      console.log('Starting with args: ' + e.data.args);
      GPGClient.arguments = e.data.args;
      if (e.data.stdin)
        GPGClient.stdin = e.data.stdin;
      importScripts('gpg.js');
      break;
  }
}, false);


