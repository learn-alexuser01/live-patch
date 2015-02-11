var fs = require('fs');
var patch = require('../')();
var gaze = require('gaze');

gaze('program.js', function (err, w) {
    w.on('changed', function (p) {
        read(function (err, src) {
            if (err) return console.error(err);
            patch.update(src);
        });
    });
});
read(function (err, src) {
    if (err) return console.error(err);
    patch.update(src);
});

function read (cb) {
    fs.readFile('program.js', 'utf8', cb)
}
