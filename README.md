# kabook

Examples and recipes for [kaboot](https://github.com/fpereiro/kaboot').

## Examples

Require kaboot and [kaboots](https://github.com/fpereiro/kaboots')

```javascript
   var k = require ('kaboot');
   k.extend ('kaboots');
```

Define a function to install node.js on a local or remote machine.

```javascript
   var installNode = function (s, host, key) {
      return ['Install node.js', {host: host, key: key, path: '/tmp'}, [
         ['Download nodejs setup script', k.run, 'wget https://deb.nodesource.com/setup'],
         ['Execute nodejs setup script', k.run, '/bin/bash setup'],
         ['Remove setup script', k.run, 'rm setup'],
         ['Install node.js package', k.debian.install, 'nodejs'],
         ['Install forever', k.run, 'npm install forever -g']
      ]];
   }
```

Define a function to deploy a node.js app to a remote repo.

```javascript
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
```

Place the trigger, so that the script can be used like this:

- `node example install HOST_IP KEY`
- `node example deploy HOST_IP KEY`

(In both cases, the `KEY` is optional).

```javascript
   k.fire ({
      install: ['Install node.js', installNode, '@host', '@key'],
      deploy:  ['Deploy application', deploy, '@host', '@key']
   });
```

## Installation

`npm install kabook`

Besides core kaboot, this library also depends on [kaboot's standard library](https://github.com/fpereiro/kaboots).

## Intrigued? Here's your hard hat!

Kaboot is undergoing a radical rewrite. While its main concepts and structures are firmly in place, large sections of core functionality are still being worked out.

If you are at all interested by what you've seen so far, I would love to hear your suggestions and requests: my email is fpereiro@gmail.com

## License

Kaboot is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
