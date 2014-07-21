var k = require ('kaboot');
k.extend (k, require ('kaboots'));
var a = require ('astack');
var dale = require ('dale');
var fs = require ('fs');

var log = console.log;

function monitor (aStack, serverListPath, key) {
   var serverList = JSON.parse (fs.readFileSync (serverListPath, {encoding: 'utf8'}));
   serverList = dale.do (serverList, function (v) {
      return {host: v, key: key}
   });
   k.do (aStack, [
      [k.cFork, serverList, [k.monitor.vmstat]],
      [function (aStack) {
         // If we are here, it is because all the servers could run the command successfully.
         var problemServers = [];
         dale.do (aStack.last, function (v, k) {
            // If there are less than 50mb (50000 kb) of free memory or CPUs are less than 10% idle, we consider this a problem.
            if (v.free < 50000 || v.id < 10) problemServers.push (serverList [k].host);
         });
         if (problemServers.length > 0) {
            aStack.problemServers = problemServers;
            return a.return (aStack, false);
         }
         else return a.return (aStack, true);
      }]
   ]);
}

k.fire (['Monitor servers', monitor, '@1', '@2'], {
   false: ['Report problem', function (aStack) {
      if (aStack.problemServers) log ('Servers having problems! List of servers:', aStack.problemServers);
      else log ('There was a problem connecting to one or more of the servers.');
      a.return (aStack, false);
   }],
   true: ['Report OK', function (aStack) {
      log ('Everything OK!');
      a.return (aStack, true);
   }]
});
