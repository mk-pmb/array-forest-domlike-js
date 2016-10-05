/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var arrayForest = require('array-forest-domlike'), branch, tree,
  jsobj2branch = require('../trafo/jsobj2branch.js'),
  dummyData = require('../package.json'),
  assert = require('assert'), eq = assert.deepStrictEqual;

dummyData = Object.assign(dummyData, { version: null, name: 'itsme' });
branch = jsobj2branch(dummyData);
eq(String(branch),  '[ArrayForestWood <object> name=itsme +10]');
branch.tagName = 'pkg';
eq(String(branch),  '[ArrayForestWood <pkg> name=itsme +10]');

tree = branch.tree();
eq(String(tree),    '[ArrayForestBranch <pkg> name=itsme +10]');

(function removeProps() {
  // first some tests
  var props = tree.tn('prop');
  eq(props.length, undefined);
  eq((typeof props.len), 'function');
  eq(props.len(), 1);
  eq(props, tree.childrenByTagName('prop'));
  eq(props.forEach, undefined);
  eq((typeof props.map), 'function');
  props.map(function (prop) {
    eq(prop.up, prop.parent);
    var parentBranch = prop.parent();
    eq(parentBranch, tree);
  });
  eq(props.rm, props.detach);
  eq(props.n(0).rm, props.n(0).detachFromParent);
  // now the action in short notation:
  tree.tn('prop').rm();
  eq(String(tree),    '[ArrayForestBranch <pkg> name=itsme +9]');
  eq(tree.tn('prop').len(), 0);
}());











module.exports = { bran: branch, tree: tree, arf: arrayForest,
  wood: arrayForest.wood,
  };
if (process.argv[2] === '-i') {
  Object.assign(require('repl').start().context, module.exports);
}
process.on('exit', function () { console.log('+OK usage tests passed.'); });
