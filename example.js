/*
kabook - v0.9.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please run this example by entering `node example` at the command prompt.
*/

(function () {

   var k = require ('kaboot');
   k.extend ('kaboots');

   var installNode = function (s, host, key) {
      return ['Install node.js', {host: host, key: key, path: '/tmp'}, [
         ['Download nodejs setup script', k.run, 'wget https://deb.nodesource.com/setup'],
         ['Execute nodejs setup script', k.run, '/bin/bash setup'],
         ['Remove setup script', k.run, 'rm setup'],
         ['Install node.js package', k.debian.install, 'nodejs'],
         ['Install forever', k.run, 'npm install forever -g']
      ]];
   }

   var deploy = function (s, host, key) {
      return ['Deploy app', [
         ['tar the repo', k.unix.tar, {compress: '.', to: '/tmp/app.tar.gz'}],
         ['scp the repo', k.unix.scp, {from: '/tmp/app.tar.gz', to: {host: host, key: key, path: '/tmp'}}],
         [{host: host, key: key, path: '/root/app'}, [
            ['Remove files from folder', k.run, 'rm /root/app/* -r'],
            ['Untar the repo', k.unix.tar, {extract: '/tmp/app.tar.gz', to: '/root/app'}],
            ['Stop application', k.run, 'forever stopall'],
            ['Install packages', k.run, 'npm install'],
            ['run the app',      k.run, 'forever start server.js'],
            ['Remove tar',       k.run, 'rm /tmp/app.tar.gz'],
         ]],
         ['remove local tar', k.run, 'rm /tmp/app.tar.gz'],
      ]];
   }

   k.fire ({
      install: ['Install node.js', installNode, '@host', '@key'],
      deploy:  ['Deploy application', deploy, '@host', '@key']
   });

}) ();
