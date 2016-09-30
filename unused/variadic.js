/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports;


EX.typeof1 = function (x) {
  if (x === null) { return 'N'; }
  var t = typeof x;
  if (t === 'object') {
    if (Array.isArray(x)) { return 'A'; }
    return 'o';
  }
  switch (t) {
  case 'boolean':
  case 'function':
  case 'number':
  case 'string':
  case 'undefined':
    return t[0];
  case 'symbol':
    return '$';
  }
  throw new TypeError('strange unexpected JS type: ' + t);
};


EX.scanArgTypes = function (args, offset, signatureRgx) {
  args = Array.prototype.slice.call(args, (offset || 0));
  args.types = args.map(EX.typeof1).join('');
  args.signa = false;
  if (signatureRgx) {
    args.signa = signatureRgx.exec(args.types);
    if (!args.signa) {
      throw new Error('unsupported argument types: '
        + (args.types || '<no args>'));
    }
  }
  return args;
};















/*scroll*/
