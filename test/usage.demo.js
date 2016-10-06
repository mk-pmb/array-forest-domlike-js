/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var arrayForest = require('array-forest-domlike'), branch, tree,
  jsobj2branch = require('../trafo/jsobj2branch.js'),
  dummyData = require('../package.json'),
  assert = require('assert'), eq = assert.deepStrictEqual;

dummyData = Object.assign(dummyData, { version: null, name: 'itsme' });
branch = jsobj2branch(dummyData);
tree = branch.tree();

eq(tree.tn(),       'object');
eq(tree.nm(),       'itsme');
eq(tree.id(),       '');
eq(String(branch),  '[ArrayForestWood <object> name=itsme +10]');
eq(String(tree),    '[ArrayForestBranch <object> name=itsme +10]');

branch.tagName = 'pkg';
eq(tree.tn(),       'pkg');
eq(String(branch),  '[ArrayForestWood <pkg> name=itsme +10]');
eq(String(tree),    '[ArrayForestBranch <pkg> name=itsme +10]');


(function removeProps() {
  // first some tests
  var props = tree.tn('prop'), prev, next;
  eq(tree.nc, tree.countChildren);
  eq(tree.nc(), 10);
  eq(tree.ch(-1), tree.lastChild());
  eq(tree.ch(-1).toString(), '[ArrayForestBranch #9 <null> id=version +0]');
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
  prev = tree.tn('prop', 0).prevSib();
  next = tree.tn('prop', 0).nextSib();
  tree.tn('prop').rm();
  eq(String(tree),    '[ArrayForestBranch <pkg> name=itsme +9]');
  eq(tree.tn('prop').len(), 0);
  eq(tree.nc(), 9);
  eq(String(prev.sib(1)), String(next));
  eq(prev.sib(1), next);
  eq(String(next.sib(-1)), String(prev));
  eq(next.sib(-1), prev);
  eq(tree.ch(-1).toString(), '[ArrayForestBranch #8 <null> id=version +0]');
}());


eq(branch.map(String),
  [ '[ArrayForestWood #0 <object> id=bugs +0]',
    '[ArrayForestWood #1 <object> id=dependencies +0]',
    '[ArrayForestWood #2 <object> id=devDependencies +0]',
    '[ArrayForestWood #3 <object> id=directories +0]',
    '[ArrayForestWood #4 <array> id=keywords +7]',
    '[ArrayForestWood #5 <boolean> id=private +1]',
    '[ArrayForestWood #6 <object> id=repository +0]',
    '[ArrayForestWood #7 <object> id=scripts +0]',
    '[ArrayForestWood #8 <null> id=version +0]',
    ]);

eq(tree.ch().map(String),
  [ '[ArrayForestBranch #0 <object> id=bugs +0]',
    '[ArrayForestBranch #1 <object> id=dependencies +0]',
    '[ArrayForestBranch #2 <object> id=devDependencies +0]',
    '[ArrayForestBranch #3 <object> id=directories +0]',
    '[ArrayForestBranch #4 <array> id=keywords +7]',
    '[ArrayForestBranch #5 <boolean> id=private +1]',
    '[ArrayForestBranch #6 <object> id=repository +0]',
    '[ArrayForestBranch #7 <object> id=scripts +0]',
    '[ArrayForestBranch #8 <null> id=version +0]',
    ]);

eq(tree.id('directories').toString(),
  '[ArrayForestBranch #3 <object> id=directories +0]');
eq(tree.id('directories').at(),
  { id: 'directories', doc: 'doc', test: 'test' });










module.exports = { bran: branch, tree: tree, arf: arrayForest,
  wood: arrayForest.wood,
  };
if (process.argv[2] === '-i') {
  Object.assign(require('repl').start().context, module.exports);
}
process.on('exit', function () {
  console.log('+OK usage tests passed.');   //= `+OK usage tests passed.`
});
