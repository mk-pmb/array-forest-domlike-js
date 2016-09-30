/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = {
  ary: Array.isArray,
  fin: Number.isFinite,
  fun: function (x) { return ((typeof x) === 'function'); },
  num: function (x) { return ((typeof x) === 'number'); },
  obj: function (x) { return ((x && typeof x) === 'object'); },
  str: function (x) { return ((typeof x) === 'string'); },

  numInRange: function (x, a, b) {
    return ((x === +x) && (x >= a) && (x <= b));
  },

};
