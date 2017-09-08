# @mapbox/rehype-highlight-code-block

[![Build Status](https://travis-ci.org/mapbox/rehype-highlight-code-block.svg?branch=master)](https://travis-ci.org/mapbox/rehype-highlight-code-block)

[rehype] plugin that finds code blocks in HTML and lets you highlight them with a function.

**Best suited for Node**, because it includes an HTML parser, [parse5](https://github.com/inikulin/parse5), to parse the return value of your highlighting function.
If you are doing your syntax highlighting in the browser, you might consider [lowlight] or [refractor], both of which will work with [rehype] or other [unified] tools.

## Installation

```
npm install @mapbox/rehype-highlight-code-block
```

## API

Follow the directions for using rehype plugins.

`rehype().use(rehypeHighlightCodeBlock, options)`

### options

#### highlight

Type: `(code: string, lang?: string) => ?string`.
**Required.**

A function that accepts two arguments, `code` and `lang`, and returns a string of HTML representing `code` with syntax highlighting (or a falsy value if you don't want to highlight that block).

Every time a `pre > code` node is found, its contents are passed to `options.highlight`.
The language passed to `options.highlight` with the code is determined by the first `language-` or `lang-` class found on the `code` node.

If `options.highlight` returns a falsy value, the code block will not be altered.
If it returns an HTML string, that string will be parsed and inserted into the AST.

## Usage

Use [as a rehype plugin](https://github.com/wooorm/rehype/blob/master/doc/plugins.md#using-plugins).

Some examples of how you might do that:

```js
const rehype = require('rehype');
const rehypeHighlightCodeBlock = require('rehype-highlight-code-block');
const yourHighlightingFunction = require('../path/to/it');

rehype()
  .use(rehypeHighlightCodeBlock, {
    highlight: yourHighlightingFunction
  })
  .process(/* some html */);
```

```js
const unified = require('unified');
const rehypeParse = require('rehype-parse');
const rehypeHighlightCodeBlock = require('rehype-highlight-code-block');
const yourHighlightingFunction = require('../path/to/it');

unified()
  .use(rehypeParse)
  .use(rehypeHighlightCodeBlock, {
    highlight: yourHighlightingFunction
  })
  .processSync(/* some html */);
```

If you'd like to get syntax highlighting in Markdown, parse the Markdown (with remark-parse), convert it to rehype, then use this plugin.

```js
const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkRehype = require('remark-rehype');
const rehypeHighlightCodeBlock = require('rehype-highlight-code-block');
const yourHighlightingFunction = require('../path/to/it');

unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeHighlightCodeBlock, {
    highlight: yourHighlightingFunction
  })
  .process(/* some markdown */);
```

[rehype]: https://github.com/wooorm/rehype
[unified]: https://github.com/unifiedjs/unified
[lowlight]: https://github.com/wooorm/lowlight
[refractor]: https://github.com/wooorm/refractor
