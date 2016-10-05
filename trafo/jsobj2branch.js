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
      return (Array.isArray(val)
        ? arrayForest.sprout({ tagName: 'array', children: val.map(EX) })
        : EX.fromObj(val));
    }
    return arrayForest.sprout({ tagName: vtype, nodeValue: String(val) });
  };


  EX.fromObj = function (obj) {
    var br = arrayForest.sprout({ tagName: 'object' });
    Object.keys(obj).sort().forEach(EX.addProp.bind(null, br, obj));
    return br;
  };


  EX.addProp = function (br, srcObj, key) {
    var sub = srcObj[key];
    if ((typeof sub) !== 'string') {
      sub = EX(sub);
      arrayForest.wood.setAttribute(sub, 'id', key);
      return arrayForest.wood.adoptChild(br, sub);
    }
    if (key.match(/^[a-z]{1,16}$/) && (key !== 'id')) {
      return arrayForest.wood.setAttribute(br, key, sub);
    }
    sub = arrayForest.sprout({ tagName: 'prop', id: key, nodeValue: sub });
    return arrayForest.wood.adoptChild(br, sub);
  };











  return EX;
}());
