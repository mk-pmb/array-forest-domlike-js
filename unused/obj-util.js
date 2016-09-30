/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports;


EX.objMap = function (obj, iter, dest) {
  if (!dest) { dest = {}; }
  if (!obj) { return dest; }
  Object.keys(obj).map(function (key) { dest[key] = iter(obj[key], key); });
  return dest;
};













/*scroll*/
