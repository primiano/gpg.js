var GPGClient = {
  'arguments': [],
  'stdin': null,
  'print': function(msg) { postMessage({f: 'stdout', data: msg}); },
  'printErr': function(msg) { postMessage({f: 'stderr', data: msg}); },
  'terminate': function() { close(); }
 };

// Hack for Safari.
var console;
if (console === undefined) {
  console = {
    log: function() {},
  };
}

self.addEventListener('message', function(e) {
  if (e.data.cmd == undefined)
    return;
  switch (e.data.cmd) {
    case 'start':
      GPGClient.arguments = e.data.args;
      if (e.data.stdin)
        GPGClient.stdin = e.data.stdin;
      importScripts('gpg.js');
      break;
  }
}, false);
