var k = require ('kaboot');

k.extend (k, require ('kaboots'));

function installNode (aStack, host, key) {
   k.do (aStack, {
      host: host,
      key: key
   }, [
      ['Add node.js repo', k.debian.addRepo, 'chris-lea/node.js'],
      ['Update packages', k.debian.update],
      ['Install node.js package', k.debian.install, 'nodejs'],
      ['Install forever', k.run, 'sudo npm install -g forever']
   ]);
}

k.fire (['Install node.js', installNode, '@1', '@2']);
