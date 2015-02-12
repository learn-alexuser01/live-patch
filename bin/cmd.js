#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var gaze = require('gaze');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
    alias: { h: 'help' }
});
var file = argv._[0];

if (argv.help) return usage();

var ix = process.argv.indexOf(file)
if (ix >= 0) process.argv.splice(ix, 1);

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

function usage () {
    fs.createReadStream(path.join(__dirname, 'usage.txt'))
        .pipe(process.stdout)
    ;
}
