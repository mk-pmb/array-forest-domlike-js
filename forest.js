/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var EX = {}, woodApi = require('./lib/wood.js'),
    ArfBranch = require('./lib/branch.js'),
    ArfNodeList = require('./lib/nodelist.js'),
    hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);


  EX.wood = woodApi;
  EX.Branch = ArfBranch;
  EX.NodeList = ArfNodeList;


  EX.sprout = function (opt) {
    opt = (opt || false);
    var br = woodApi.blessArray((opt.seed || []), opt);
    if (!hasOwn(br, 'tree')) { br.tree = EX.sprout.makeTree; }
    return br;
  };
  EX.sprout.makeTree = function makeTree() {
    if (this.tree === makeTree) {
      this.tree = Object.bind(null, new ArfBranch(this));
    }
    return this.tree();
  };


  EX.createElement = function (tagName) {
    tagName = (String(tagName || '') || null);
    return EX.sprout({ tagName: tagName });
  };


















  return EX;
}());
