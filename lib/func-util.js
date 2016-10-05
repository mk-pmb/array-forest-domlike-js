/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var EX = {};

  EX.errIf = function (bad, errmsg, val) {
    if (!bad) { return; }
    errmsg = String(errmsg || bad);
    if (arguments.length > 2) {
      errmsg += ' <' + (typeof val) + '> ' + String(val);
    }
    throw new Error(errmsg);
  };


  EX.wantNoArgs = function (funcName, args) {
    if (args.length === 0) { return; }
    if (args[0] === 'ignoreArgs') { return; }
    throw new Error(funcName + '() wants no arguments. Omit them, or set ' +
      'the first argument to "ignoreArgs" to explicitly ignore the others.');
  };










  return EX;
}());
