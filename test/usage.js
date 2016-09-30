/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var arrayForest = require('array-forest-domlike'), branch, tree,
  jsobj2branch = require('../trafo/jsobj2branch.js'),
  dummyData = require('../package.json'),
  assert = require('assert'), eq = assert.deepStrictEqual;

dummyData = Object.assign(dummyData, { version: null });
branch = jsobj2branch(dummyData);
eq(String(branch),  '[ArrayForestWood <obj> name=array-forest-domlike +10]');

tree = branch.tree();
eq(String(tree),    '[ArrayForestBranch <obj> name=array-forest-domlike +10]');










console.log('+OK usage tests passed.');
