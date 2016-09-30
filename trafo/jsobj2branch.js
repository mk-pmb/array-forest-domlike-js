/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var EX, arrayForest = require('array-forest-domlike');

  EX = function convertJsValueToTagNameArray(val) {
    if ((val === null) || (val === undefined)) {
      return arrayForest.sprout({ tagName: String(val) });
    }
    var vtype = typeof val;
    if (val && (vtype === 'string')) { return val; }
    if (vtype === 'object') {
      if (Array.isArray(val)) {
        return arrayForest.sprout({ tagName: 'arr', children: val.map(EX) });
      }
      return EX.fromObj(val);
    }
    return arrayForest.sprout({ tagName: vtype, nodeValue: String(val) });
  };


  EX.fromObj = function (obj) {
    var br = arrayForest.sprout({ tagName: 'obj' });
    Object.keys(obj).sort().forEach(EX.addProp.bind(null, br, obj));
    return br;
  };


  EX.addProp = function (br, srcObj, key) {
    var sub = srcObj[key];
    if ((typeof sub) !== 'string') {
      sub = EX(sub);
      arrayForest.wood.setAttribute(sub, 'id', key);
      return br.push(sub);
    }
    if (key.match(/^[a-z]{1,16}$/) && (key !== 'id')) {
      return arrayForest.wood.setAttribute(br, key, sub);
    }
    sub = arrayForest.sprout({ tagName: 'prop', id: key, nodeValue: sub });
    return br.push(sub);
  };











  return EX;
}());
