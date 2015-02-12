# live-patch

live patch a running program

Currently this module is nothing more than cheap parlor tricks.

Whether any module claiming these features can ever be more than flimsy
cardboard is an open question.

![demo](example/demo.gif)

# example

First whip up a patch.js to monitor a program.js file for changes:

``` js
var fs = require('fs');
var gaze = require('gaze');
var file = __dirname + '/program.js';

var patch = require('live-patch')();

gaze(file, function (err, w) {
    w.on('changed', function (p) { read() });
});
read();

function read () {
    fs.readFile(file, 'utf8', function (err, src) {
        if (err) return console.error(err);
        patch.update(src);
    });
}
```

run patch.js and then then edit `program.js` live and watch the output.

# methods

``` js
var patch = require('live-patch')
```

## var p = patch(src)

Create a patch instance `p`, optionally with some source code `src`.

## p.update(src)

Set the source code to `src`, updating the running state as necessary.

# usage

This package comes with a command-line tool.

```
live-patch {OPTIONS} FILE [ARGS...]

  Run FILE with node, watching for changes.
  When FILE changes, the new source is patched in.

  -h --help  Show this message.

```

# todo

I'm not especially keen to develop this prototype much further, but if somebody
wants, these features would lead to a more robust tool:

* create a dependency graph for AST updates - when you update `var x`, you also
implicitly update `var y = x + 10` and so on.

As it stands this demo is already pushing the limits of what undisciplined AST
trickery is reasonably capable of.

# install

With [npm](https://npmjs.org) do:

```
npm install live-patch
```

to get the library or

```
npm install -g live-patch
```

to get the command-line tool.

# license

MIT
