/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  // Utilities to deal with wood.
  // Wood is what your trees and branches are made of (i.e. your arrays).

  var EX = {}, is = require('./typechecks.js'),
    funcUtil = require('./func-util.js'), errIf = funcUtil.errIf,
    arraynge = require('arraynge'),
    hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);

  EX.filter = require('./filter.js');


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
    if (!hasOwn(seed, 'toString')) { seed.toString = EX.describeThis; }
    if (seed.root) { throw new Error('Seed already struck a root'); }
    seed.root = seed.self = Object.bind(null, seed);

    // attributes
    if (is.obj(seed.attrib)) {
      Object.assign(seed.attrib, opts.attrib);
    } else {
      seed.attrib = (opts.attrib || false);
    }
    if (opts.id) { EX.setAttribute(seed, 'id', opts.id); }
    if (opts.name) { EX.setAttribute(seed, 'name', opts.name); }
    if (opts.className) { EX.setAttribute(seed, 'class', opts.className); }

    // family
    if (opts.parent) { EX.adoptChild(opts.parent, seed, opts.childIndex); }
    if (opts.children) {
      opts.children.forEach(EX.appendChildOrValue.bind(null, seed));
    }
    if (opts.child) { EX.appendChildOrValue(seed, opts.child); }
    if (opts.nodeValue !== undefined) {
      seed.push(EX.validateNodeValue.orThrow(opts.nodeValue));
    }
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
    // hint: ^-- returns wood or throws.
  };


  EX.adoptChild = function (parent, child, idx) {
    if (parent === child) { throw new Error('Branch cannot adopt itself.'); }
    EX.expectWood(child, 'Prospective child');
    var par = EX.expectWood(parent, 'Adopting parent').self;
    if (child.parent) {
      errIf(EX.isAncestorOf(parent, child) === 1,
        'Already adopted by this very parent.');
      throw new Error('Custody battle');
    }
    errIf(EX.isAncestorOf(child, parent),
      'Branches cannot adopt their ancestors.');
    child.parent = par;
    if (!is.numInRange(idx, 0, parent.length)) { idx = parent.length; }
    child.childIndex = idx;
    if (idx === parent.length) {
      parent[idx] = child;
    } else {
      parent.splice(idx, 0, child);
      EX.reindexChildren(false, parent, idx + 1);
    }
    child.root = parent.root;
    return parent;
  };


  EX.reindexChildren = function (opt, par, offset) {
    var idx, ch;
    for (idx = (+offset || 0); idx < par.length; idx += 1) {
      ch = par[idx];
      (ch || false).childIndex = idx;
      if (opt.convert) { ch = opt.convert(ch); }
      if (opt.onto) { opt.onto[idx] = ch; }
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
    errIf(true, (errmsg || 'unsupported nodeValue type:'), val);
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


  EX.isAncestorOf = function (maybeAncestor, maybeOffspring) {
    var dist = 0, anc = maybeOffspring;
    while (anc) {
      if (anc === maybeAncestor) { return dist; }
      // ^-- zero is a good choice for self: as a number, it reflects
      //     the correct distance, and its false-iness states that
      //     it is not an ancestor by usual definition.
      anc = EX.findParentOf(anc);
      dist += 1;
    }
    return false;
  };


  EX.abandonChildren = function abandon(parent, children) {
    var byIndex = {}, reindexFrom = parent.length;
    if (children.length === 0) { return parent; }
    if (children.length === 1) { return abandon.justOne(parent, children[0]); }
    EX.expectWood(parent, 'Parent');
    children.forEach(function (ch) {
      ch = EX.findChildBranchOrIndex(parent, ch);
      var idx = ch.idx;
      byIndex[idx] = true;
      if (idx < reindexFrom) { reindexFrom = idx; }
    });
    children = [];
    parent.forEach(function backupToBeKeptChildren(ch, idx) {
      if (!byIndex[idx]) { children.push(ch); }
    });
    EX.reindexChildren({ onto: parent, convert: EX.forgetParent
      }, children, reindexFrom);
    parent.splice(children.length, parent.length);
    return parent;
  };
  EX.abandonChildren.justOne = function (parent, child) {
    EX.expectWood(parent, 'Parent');
    child = EX.findChildBranchOrIndex(parent, child);
    EX.forgetParent(child.child);
    parent.splice(child.idx, 1);
    return parent;
  };


  EX.forgetParent = function (child) {
    if (child) {
      child.parent = false;
      child.childIndex = null;
      child.root = child.self;
    }
    return child;
  };


  EX.findChildBranchOrIndex = function (parent, child) {
    EX.expectWood(parent, 'Parent');
    var idx = null;
    if (is.fin(child)) {
      errIf(!is.numInRange(child, 0, parent.length - 1),
        'Child index out of range:', child);
      idx = child;
      child = parent[idx];
    } else {
      if (child && is.fin(child.childIndex)) {
        idx = child.childIndex;
        errIf(idx < 0, 'Child index must be non-negative, not', idx);
        errIf(idx >= parent.length, 'Parent less children than' + idx,
          parent);
        errIf(parent[idx] !== child, 'Index mismatch: Child #' + idx +
          '/ ' + parent.length + ' is', parent[idx]);
      }
    }
    errIf(idx === null, 'Child must be given as index or branch, not', child);
    return { idx: idx, child: child };
  };


  EX.guessChildIndex = function (parent, child) {
    if (!is.ary(parent)) { return false; }
    var slots = [];
    parent.map(function (ch, idx) { if (ch === child) { slots.push(idx); } });
    return (slots.length === 1 ? slots[0] : false);
  };













  return EX;
}());
