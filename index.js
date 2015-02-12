var scoper = require('scoper');
var patcher = require('patcher');
var falafel = require('falafel');
var getscope = require('scoper/lib/getscope');
var has = require('has');

module.exports = Patch;

function Patch (src) {
    if (!(this instanceof Patch)) return new Patch(src);
    if (src) this.update(src);
}

Patch.prototype.update = function (src) {
    var opts = {};
    if (this.context) opts.names = this.context.names;
    var nsrc = scoper('(function(){' + src + '})()', opts);
    var c = Function('return ' + nsrc)();
    
    if (this.context) {
        var ctx = this.context;
        c.patch(ctx);
        var fpatch = patcher.computePatch(ctx.function, c.function);
        var lpatch = patcher.computePatch(ctx.literal, c.literal);
        if (fpatch) patcher.applyPatch(ctx.function, fpatch);
        if (lpatch) patcher.applyPatch(ctx.literal, lpatch);
        
        var keys = Object.keys(c.names)
        var names = keys.map(function (n) { return c.names[n] });
        var vars = keys.map(function (k) { return ctx[k] });
        
        if (lpatch) Object.keys(lpatch).forEach(function (key) {
            var fsrc = ';(' + fpatch[key] + ')()';
            var ix = 0;
            falafel(fsrc, function (node) {
                if (node.type !== 'Identifier') return;
                if (node.name !== c.names.literal) return;
                var up = upexpr(node);
                if (getscope(ctx.scope, node) !== key) return;
                if (!has(lpatch[key], ix ++)) return;
                Function(names, up.source()).apply(null, vars);
            });
        });
    }
    else {
        this.context = c;
        c.run();
    }
};

function upexpr (node) {
    if (node.type === 'ExpressionStatement') {
        return node;
    }
    else return upexpr(node.parent);
}
