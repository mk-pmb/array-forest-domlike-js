/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  // Utilities to deal with wood.
  // Wood is what your trees and branches are made of (i.e. your arrays).

  var EX = {}, is = require('./typechecks.js'),
    arraynge = require('arraynge'),
    hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);


  function padstr(b, s, a) { return (s ? (b + String(s) + (a || '')) : ''); }


  EX.blessArray = function (seed, opts) {
    if (!opts) { opts = false; }
    if (!is.ary(seed)) { throw new Error('cannot blessArray() a non-array'); }
    if (seed.parent) { throw new Error('can only blessArray() orphans'); }
    seed.parent = false;
    seed.childIndex = null;
    if (!seed.tagName) {    // empty string? not supported.
      seed.tagName = (opts.tagName || false);
    }
    seed.root = seed.self = Object.bind(null, seed);
    if (opts.children) {
      opts.children.forEach(EX.appendChildOrValue.bind(null, seed));
    }
    if (opts.child) { EX.appendChildOrValue(seed, opts.child); }
    if (opts.nodeValue !== undefined) {
      seed.push(EX.validateNodeValue.orThrow(opts.nodeValue));
    }
    if (opts.parent) { EX.adoptChild(opts.parent, seed, opts.childIndex); }
    if (is.obj(seed.attrib)) {
      Object.assign(seed.attrib, opts.attrib);
    } else {
      seed.attrib = (opts.attrib || false);
    }
    if (opts.id) { EX.setAttribute(seed, 'id', opts.id); }
    if (opts.name) { EX.setAttribute(seed, 'name', opts.name); }
    if (opts.className) { EX.setAttribute(seed, 'class', opts.className); }
    if (!hasOwn(seed, 'toString')) { seed.toString = EX.describeThis; }
    return seed;
  };


  EX.describeThis = function () {
    var cn = (is.ary(this) ? 'ArrayForestWood' : this.constructor.name);
    return '[' + cn + ' ' + EX.describeDetails(this) + ']';
  };
  EX.describeDetails = function (wood) {
    if ((typeof wood) === 'string') {
      return ('text=' + JSON.stringify(wood.slice(0, 32)) +
        '<' + wood.length + '>');
    }
    if (!is.ary(wood)) { return ('?? ' + String(wood)); }
    var attr = (wood.attrib || false);
    return (padstr('<', wood.tagName, '> ') +
      'id=name=class='.replace(/(\w+)=/g,
        function (m, a) { return padstr(m, attr[a], ' '); }) +
      '+' + wood.length);
  };


  EX.identifiesAsSelf = function (wood) {
    var selfWithoutContext = (wood || false).self;
    if (!selfWithoutContext) { return false; }
    if (!is.fun(selfWithoutContext)) { return false; }
    return (selfWithoutContext() === wood);
  };
  EX.identifiesAsSelf.must = function (wood, name) {
    if (EX.identifiesAsSelf(wood)) { return wood; }
    throw new Error(name + ' must identify as .self()!');
  };


  EX.expectWood = function (wood, descr) {
    if (!is.ary(wood)) { throw new Error(descr + ' must be an array!'); }
    return EX.identifiesAsSelf.must(wood, descr);
  };


  EX.adoptChild = function (parent, child, idx) {
    EX.expectWood(child, 'Prospective child');
    if (child.parent) { throw new Error('Custody battle'); }
    child.parent = EX.expectWood(parent, 'Adopting parent').self;
    EX.expectValidParent(parent);
    if (!is.numInRange(idx, 0, parent.length)) { idx = parent.length; }
    child.childIndex = idx;
    if (idx === parent.length) {
      parent[idx] = child;
    } else {
      parent.splice(idx, 0, child);
      EX.reindexChildren(parent, idx + 1);
    }
    child.root = parent.root;
    return parent;
  };


  EX.reindexChildren = function (par, offset) {
    var idx;
    for (idx = (+offset || 0); idx < par.length; idx += 1) {
      (par[idx] || false).childIndex = idx;
    }
    return par;
  };


  EX.appendChildOrValue = function (parent, childOrValue) {
    if (is.ary(childOrValue)) { return EX.adoptChild(parent, childOrValue); }
    parent.push(childOrValue);
    return parent;
  };


  EX.innerText = function (wood) {
    if (is.str(wood)) { return wood; }
    if (is.ary(wood)) {
      if (wood.length === 0) {
        if (wood.tagName) { return ''; }  // not a data leaf
        return (is.str(wood.nodeValue) ? wood.nodeValue : '');
      }
      return wood.map(EX.innerText).join('');
    }
    return '';
  };


  EX.findParentOf = function (child) {
    if (!child.parent) { return false; }
    var parentNode = child.parent();
    // EX.expectWood(parentNode, 'Parent');
    return parentNode;
  };


  EX.withParentOf = function (child, doWhat, withOrphan) {
    var parentNode = EX.findParentOf(child);
    if (!parentNode) { return (withOrphan ? withOrphan(child) : false); }
    if (is.fun(this)) { doWhat = this; }
    return doWhat(parentNode);
  };


  EX.mapIndexRange = function (nodes, fromIdx, lastIdx, iter) {
    return arraynge(fromIdx, lastIdx, nodes
      ).trueMax().warpZero().confine().map(iter);
  };


  EX.validateNodeValue = function (val) {
    // Type support might grow in future versions.
    return ((typeof val) === 'string');
  };
  EX.validateNodeValue.orThrow = function (val, errmsg) {
    if (EX.validateNodeValue(val)) { return val; }
    throw new Error((errmsg || 'unsupported nodeValue type:') +
      ' <' + (typeof val) + '> ' + String(val));
  };


  EX.setAttribute = function (br, attr, val) {
    if (!br.attrib) { br.attrib = {}; }
    if (val === undefined) {
      delete br.attrib[attr];
    } else {
      br.attrib[attr] = val;
    }
    return br;
  };











  return EX;
}());
