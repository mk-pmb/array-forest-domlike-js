/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function () {
  var EX = function makeSimpleLeafNode(parentEasyNode, tagName, attrs) {
    var easyNode = [];
    easyNode.tagName = tagName;
    easyNode.attrib = (attrs || false);
    easyNode.self = Object.bind(null, easyNode);
    easyNode.parent = ((parentEasyNode && parentEasyNode.self) || false);
    easyNode.toString = EX.nodeToString;
    return easyNode;
  };

  EX.nodeToString = function () {
    if (!this.tagName) {
      switch (this.data && typeof this.data) {
      case '':
      case 'string':
        return ('[xmlTextNode ' + JSON.stringify(this.data.slice(0, 32))
          + '<' + this.data.length + '>]');
      }
    }
    return ('[xmlNode ' + String(this.tagName) + ']');
    // XmlAttrDictTag.prototype.toString.call(this[0]);
  };








  return EX;
}());