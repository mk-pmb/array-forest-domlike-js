/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


module.exports = (function setup() {
  var CF, PT, api, woodApi = require('./wood.js'),
    ArfNodeList = require('./nodelist.js'),
    funcUtil = require('./func-util.js'),
    woodFilter = require('./filter.js');


  function just1arg(func, arg) { return func.call(this, arg); }


  CF = function ArrayForestBranch(node) {
    // woodApi.expectWood(node, 'Branch seed');
    if (!(this instanceof CF)) { return new CF(node); }
    this.N = (node || false);
  };
  module.exports = CF;
  PT = CF.prototype;
  api = CF.api = {};


  PT.toString = function () {
    return '['.concat(this.constructor.name, ' ',
      woodApi.describeDetails(this.N), ']');
  };


  CF.fromThis = function () { return new CF(this); };
  CF.withNew = function (work, node) { return work.call(this, new CF(node)); };


  CF.growValueLeaf = function (value, parentBranch, idx) {
    woodApi.validateNodeValue.orThrow(value);
    var leaf = [];
    leaf.self = Object.bind(null, leaf);
    leaf.parent = parentBranch.n.self;
    leaf.childIndex = idx;
    leaf.root = parentBranch.n.root;
    leaf.nodeValue = value;
    return new CF(leaf);
  };


  api.at = api.getAttribute = function getAttribute(attrName, ifUndef) {
    if (attrName === undefined) { return (this.attrib || false); }
    var val = this.attrib[attrName];
    return (val === undefined ? ifUndef : val);
  };


  api.tx = api.innerText = ArfNodeList.innerText;
  api.children = function () { return new ArfNodeList(this.N.slice()); };


  PT.dressChildNode = function (chNode, idx, ifUndef) {
    if ((chNode === undefined) && (ifUndef !== undefined)) { return ifUndef; }
    if (Array.isArray(chNode)) {
      // woodApi.expectWood(node, 'Child node #' + idx);
      return new CF(chNode);
    }
    return CF.growValueLeaf(chNode, this, idx);
  };


  api.childByExactIndex = function (idx) {
    if (+idx !== idx) { return false; }
    return this.dressChildNode(this.N[idx], idx, false);
  };
  api.firstChild = function () { return this.childByExactIndex(0); };
  api.lastChild = function () {
    return this.childByExactIndex(this.N.length - 1);
  };


  api.mapChildrenIndexRange = function (fromIdx, lastIdx, iterFunc) {
    var parent = this, list;
    list = woodApi.mapIndexRange(this.N, fromIdx, lastIdx, function (ch, idx) {
      ch = parent.dressChildNode(ch, idx);
      if (iterFunc) { return iterFunc.call(parent, ch, idx); }
      return ch;
    });
    return (list && new ArfNodeList(list));
  };


  api.ch = function (idx) {
    if (idx === undefined) { return this.mapChildrenIndexRange(0, true); }
    if (idx < 0) { idx += this.N.length; }
    return this.childByExactIndex(idx);
  };


  api.filter = function (opt) {
    var list = woodFilter(this.N, opt,
      { convert2: this.dressChildNode.bind(this) });
    return (list && new ArfNodeList(list));
  };


  api.childrenByTagName = function (tagName, idx) {
    return this.filter({ tagName: tagName,
      nthResult: (Number.isFinite(idx) && idx) });
  };
  api.tn = function (tagName, idx) {
    return (tagName === undefined ? this.N.tagName
      : this.childrenByTagName(tagName, idx));
  };


  api.up = api.parent = function () {
    return woodApi.withParentOf(this.N, CF);
  };
  api.withParent = function (dealWithIt, withOrphan) {
    if (withOrphan) { withOrphan = just1arg.bind(null, withOrphan, this); }
    dealWithIt = CF.withNew.bind(this, dealWithIt);
    return woodApi.withParentOf(this.N, dealWithIt, withOrphan);
  };


  api.siblingByDistance = function (distance) {
    distance = (+distance || 0);
    if (distance === 0) { return this; }
    var sibIdx = this.N.childIndex + distance;
    return this.withParent(function (parentBranch) {
      return parentBranch.childByExactIndex(sibIdx);
    });
  };


  api.mapSiblingsIndexRange = function (fromIdx, lastIdx) {
    return this.withParent(function (parentBranch) {
      return parentBranch.mapCchildrenIndexRange(fromIdx, lastIdx);
    });
  };

  api.prevSib = api.previousSibling = function (distance) {
    if (distance === 0) {
      return this.mapSiblingsIndexRange(0, this.N.childIndex);
    }
    if (distance === undefined) { distance = 1; }
    return this.siblingByDistance(-distance);
  };


  api.nextSib = api.nextSibling = function (distance) {
    if (distance === 0) {
      return this.mapSiblingsIndexRange(this.N.childIndex + 1, true);
    }
    if (distance === undefined) { distance = 1; }
    return this.siblingByDistance(distance);
  };


  api.allSiblings = function () {
    return this.prevSib(0).concat(this.nextSib(0));
  };


  api.sib = function (distance) {
    return (distance === undefined ? this.allSiblings()
      : api.siblingByDistance(distance));
  };


  api.rm = api.detach = function () {
    funcUtil.wantNoArgs((CF.name || '') + '.detach', arguments);
    var childBranch = this.N;
    woodApi.withParentOf(this.N, function (parentBranch) {
      woodApi.abandonChildren.justOne(parentBranch, childBranch);
    });
    return this;
  };

























  Object.assign(PT, api);
  return CF;
}());
