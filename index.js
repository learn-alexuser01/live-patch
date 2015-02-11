var scoper = require('scoper');
var patcher = require('patcher');

module.exports = Patch;

function Patch (src) {
    if (!(this instanceof Patch)) return new Patch(src);
    if (src) this.update(src);
    this.names = {
        scope: rname(),
        function: rname(),
        literal: rname()
    };
}

Patch.prototype.update = function (src) {
    var nsrc = scoper(src, { names: this.names });
    var c = Function('return ' + nsrc)();
    
    if (this.context) {
        c.patch(this.context);
        var fpatch = patcher.computePatch(this.context.function, c.function);
        var lpatch = patcher.computePatch(this.context.literal, c.literal);
        if (fpatch) patcher.applyPatch(this.context.function, fpatch);
        if (lpatch) patcher.applyPatch(this.context.literal, lpatch);
    }
    else {
        this.context = c;
        c.run();
    }
};

function rname () {
    return '__' + (Math.pow(16, 8) * Math.random()).toString(16);
}
