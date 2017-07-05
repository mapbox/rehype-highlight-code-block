# @mapbox/rehype-highlight-code-block

[![Build Status](https://travis-ci.org/mapbox/rehype-highlight-code-block.svg?branch=master)](https://travis-ci.org/mapbox/rehype-highlight-code-block)

[rehype](https://github.com/wooorm/rehype) plugin that finds code blocks in HTML and lets you highlight them with a function.

**Best suited for Node**, because it includes [an HTML parser](https://github.com/inikulin/parse5) to parse the return value of your highlighting function.
If you are doing your syntax highlighting in the browser, you might consider [rehype-highlight](https://github.com/wooorm/rehype-highlight).

## Installation

```
npm install @mapbox/rehype-highlight-code-block
```

## API

`rehype().use(rehypeHighlightCodeBlock, options)`

**Options**

- **highlight** `(code: string, lang?: string) => ?string` (required) -
  A function that accepts two arguments, `code` and `lang`, and returns a string of HTML representing `code` with syntax highlighting (or a falsey value if you don't want to highlight that block).

Every time a `pre > code` node is found, its contents are passed to `options.highlight`.
The language passed to `options.highlight` with the code is determined by the first `language-` or `lang-` class found on the `code` node.

If `options.highlight` returns a falsey value, the code block will not be altered.
If it returns an HTML string, that string will be parsed and inserted into the AST.

## Usage

Use is as a rehype plugin.

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
