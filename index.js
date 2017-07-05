'use strict';

const visit = require('unist-util-visit');
const nodeToString = require('hast-util-to-string');
const Parser5 = require('parse5/lib/parser');
const nodeFromParse5 = require('hast-util-from-parse5');

const parse5 = new Parser5();
const LANGUAGE_CLASS_REGEXP = /^(?:language-|lang-)(\S+)/;
function getLanguage(node) {
  const className = node.properties.className || [];

  const length = className.length;
  let index = -1;
  let classListItem;
  while (++index < length) {
    classListItem = className[index];
    const match = classListItem.match(LANGUAGE_CLASS_REGEXP);
    if (match) {
      return match[1];
    }
  }

  return null;
}

module.exports = options => {
  if (!options || typeof options.highlight !== 'function') {
    throw new Error('You must provide a highlight function');
  }

  return tree => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    if (node.tagName !== 'code') return;
    if (!parent || parent.tagName !== 'pre') return;

    const lang = getLanguage(node);
    const html = options.highlight(nodeToString(node), lang);
    if (!html) return;

    const highlightedAst = nodeFromParse5(parse5.parseFragment(html));
    node.children = highlightedAst.children;
  }
};
