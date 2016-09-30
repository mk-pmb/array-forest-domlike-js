/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = function attribsToSlot0(br) {
  if (!Array.isArray(br)) { return br; }
  return [ Object.assign({}, br.attrib, { '': br.tagName })
    ].concat(br.map(attribsToSlot0));
};
