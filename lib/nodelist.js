﻿/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var CF, PT, api, woodApi = require('./wood.js'),
    funcUtil = require('./func-util.js'),
    woodFilter = require('./filter.js');


  CF = function XmlNodeList(list) {
    if (!(this instanceof CF)) { return (list && new CF(list)); }
    if (!Array.isArray(list)) { throw new Error('Expected an Array as list'); }
    this.N = list;
  };
  module.exports = CF;
  PT = CF.prototype;
  api = CF.api = {};


  PT.toString = function () {
    return '['.concat(this.constructor.name, ' n=', this.N.length, ']');
  };


  CF.fertilize = function (seed) {
    if (seed === null) { return false; }
    if (seed === undefined) { return false; }
    return ((typeof seed) === 'object' ? seed.tree() : seed);
  };


  CF.chkProp = function (x) {
    var opts = this;
    if (opts.prop !== undefined) { x = (x || false)[opts.prop]; }
    x = (x === opts.refVal);
    if (opts.invert) { x = !x; }
    return x;
  };


  api.filter = function (opt) {
    return woodFilter(this.N, opt, { convertList: CF });
  };


  api.byTagName = function (tagName, idx) {
    return this.filter({ tagName: tagName,
      nthResult: (Number.isFinite(idx) && (idx + 1)) });
  };
  api.tn = function (tagName, idx) {
    return (tagName === undefined ? this.map('tn')
      : this.byTagName(tagName, idx));
  };


  api.byName = function (name, idx) {
    return this.filter({ attrib: { name: name },
      nthResult: (Number.isFinite(idx) && (idx + 1)) });
  };
  api.nm = function (name, idx) {
    return (name === undefined ? this.at('name', '')
      : this.byName(name, idx));
  };


  api.byExactIndex = function (idx) {
    if (+idx !== idx) { return false; }
    return (this.N[idx] || false);
  };


  api.len = api.countItems = function () {
    return (+(this.N || false).length || 0);
  };


  api.toArray = function () { return this.N.slice(); };
  api.all = function () { return new CF(this.N.slice()); };

  api.map = function (iter, args) {
    var func = iter;
    switch (iter && typeof iter) {
    case 'function':
      func = iter;
      break;
    case 'string':
      func = function (node) { return node[iter].apply(node, args || []); };
      break;
    }
    return this.N.map(func);
  };
  api.raw = function () { return this.map('raw'); };
  api.up = api.parents = function () { return this.map('parent'); };
  api.rm = api.detach = function () {
    funcUtil.wantNoArgs((CF.name || '') + '.detach', arguments);
    return this.map('detach', null);
  };


  api.n = function (idx) {
    if (idx === undefined) { return this.N.length; }
    if (idx < 0) { idx += this.N.length; }
    return api.byExactIndex(this.N, idx);
  };


  api.tx = api.innerText = function () { return woodApi.innerText(this.N); };






















  Object.assign(PT, api);
  return CF;
}());
