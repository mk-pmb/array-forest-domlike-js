/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var EX = {}, woodApi = require('./lib/wood.js'),
    ArfBranch = require('./lib/branch.js'),
    ArfNodeList = require('./lib/nodelist.js');


  EX.wood = woodApi;
  EX.Branch = ArfBranch;
  EX.NodeList = ArfNodeList;


  EX.sprout = function (opt) {
    opt = (opt || false);
    var br = woodApi.blessArray((opt.seed || []), opt);
    if (!br.tree) { br.tree = ArfBranch.fromThis; }
    return br;
  };


  EX.createElement = function (tagName) {
    tagName = (String(tagName || '') || null);
    return EX.sprout({ tagName: tagName });
  };


















  return EX;
}());
