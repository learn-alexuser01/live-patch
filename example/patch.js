var fs = require('fs');
var gaze = require('gaze');
var file = __dirname + '/program.js';

var patch = require('../')();

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
