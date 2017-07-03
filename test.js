'use strict';

const rehype = require('rehype');
const dedent = require('dedent');
const rehypeHighlightCodeBlock = require('.');

const processHtml = html => {
  return rehype()
    .data('settings', { fragment: true })
    .use(rehypeHighlightCodeBlock, {
      highlight: jest.fn(() => '<span>mockSyntaxHighlighting</span>')
    })
    .processSync(html)
    .toString();
};

describe('rehypeHighlightCodeBlock', () => {
  test('mocks syntax highlighting properly', () => {
    const result = processHtml(dedent`
      <div>
        <p>foo</p>
        <pre><code>p { color: red }</code></pre>
        <p>bar</p>
      </div>
    `);
    expect(result).toMatchSnapshot();
  });
  test('does nothing to code block, missing <pre></pre>', () => {
    const result = processHtml(dedent`
      <code>p { color: red }</code>
    `);
    expect(result).toMatchSnapshot();
  });
  test('does nothing to code block, missing <code></code>', () => {
    const result = processHtml(dedent`
      <pre>p { color: red }</pre>
    `);
    expect(result).toMatchSnapshot();
  });
  test('does nothing to code block, missing pre > code', () => {
    const result = processHtml(dedent`
      <div>p { color: red }</div>
    `);
    expect(result).toMatchSnapshot();
  });
});
