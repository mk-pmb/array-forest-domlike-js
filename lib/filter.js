/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var EX;

  function identity(x) { return x; }
  function andType(x) { return (x && typeof x); }

  EX = function filterWoods(list, opt, overrides) {
    if (!opt) { return false; }
    var chkFunc, rslt, matchCount = 0;
    switch (andType(opt)) {
    case 'object':
      chkFunc = EX.checkOpts.bind(null, opt);
      break;
    case 'function':
      chkFunc = opt;
      opt = false;
      break;
    }
    if (!chkFunc) { return false; }
    rslt = [];
    if (opt.justCount) { opt.nthResult = true; }
    list.forEach(function (wood, origIdx) {
      if (!chkFunc(wood, origIdx, list)) { return; }
      matchCount += 1;
      if (opt.nthResult && (matchCount !== opt.nthResult)) { return; }
      wood = (overrides.convert1 || identity)(wood);
      wood = (overrides.convert2 || identity)(wood, origIdx);
      wood = (overrides.convert3 || identity)(wood, origIdx, list);
      wood = (opt.postprocessEach || identity)(wood, origIdx, list);
      rslt[rslt.length] = wood;
    });
    if (opt.justCount) { return matchCount; }
    if (opt.nthResult) {
      return (rslt.length && rslt[0]);
      // 0 for "no match": differs from false = "bad options"
      // and you can safely access properties on it, too.
    }
    rslt = (overrides.convertList || identity)(rslt);
    return rslt;
  };


  EX.checkOpts = function (opt, wood) {
    if (!wood) {
      wood = true;
      // => we can safely access properties still return a truthy result
      //    on match (e.g. no criteria or just "no tagname")
    }
    if (!EX.checkVal(opt.tagName, wood.tagName)) { return false; }
    if (!EX.checkVal.props(opt.attrib, wood.attrib)) { return false; }
    return true;
  };


  EX.checkVal = function (expected, actual) {
    switch (andType(expected)) {
    case undefined:
      return true;
    case null:
      return ((actual === null) || (actual === undefined));
    case '':
    case 'string':
      return (actual === expected);
    case false:
    case 'boolean':
      return (Boolean(actual) === expected);
    case 'object':
      if (Array.isArray(expected)) { return EX.isOneOf(expected, actual); }
      if (expected.exec) { return expected.exec(actual); }
      break;
    }
    return false;
  };


  EX.checkVal.props = function (expect, actual) {
    if (!expect) { return true; }
    if (!actual) { return false; }
    return Object.keys(expect).reduce(function (prev, key) {
      return (prev && EX.checkVal(expect[key], actual[key]));
    }, true);
  };


  EX.isOneOf = function (list, item) { return (list.indexOf(item) >= 0); };




















  return EX;
}());
