var k = require ('kaboot');
k.extend (k, require ('kaboots'));
var a = require ('astack');

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

function deploy (aStack, repoFolder, host, key) {
   var targetFolder = '/home/ubuntu';
   var executable = 'example.js';
   var serverURL = 'main'

   k.do (aStack, [
      ['Compress local repo into tarfile.', k.unix.tar, {
         compress: k.join (__dirname, repoFolder),
         to: k.join (__dirname, repoFolder + '.tar.gz')
      }],
      ['Copy the tarfile into the remote server.', k.unix.scp, {
         from: k.join (__dirname, repoFolder + '.tar.gz'),
         to: {host: host, key: key, path: targetFolder}
      }],
      ['Remove tarfile from local computer', k.run, __dirname, ['rm', repoFolder + '.tar.gz']],
      [k.do, {host: host, key: key}, [
         ['Extract the tarfile in the remote server', k.unix.tar, {
            extract: k.join (targetFolder, k.last (repoFolder) + '.tar.gz'),
            to: targetFolder
         }],
         ['Remove the tarfile from the remote server', k.run, targetFolder, ['rm', k.last (repoFolder) + '.tar.gz']],
         ['Install npm packages', k.run, k.join (targetFolder, k.last (repoFolder)), 'sudo npm install'],
         ['Start the application in the remote server', k.run, k.join (targetFolder, k.last (repoFolder)), ['forever start', executable]]
      ]],
      ['Ping the application in the remote server', k.hit, {host: host.replace ('ubuntu@', ''), port: 8000, path: serverURL}]
   ]);
}

k.fire ({
   install: ['Install node.js', installNode, '@1', '@2'],
   deploy: ['Deploy application', deploy, '@1', '@2', '@3']
});
