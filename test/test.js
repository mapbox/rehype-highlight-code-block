'use strict';

const rehype = require('rehype');
const dedent = require('dedent');
const rehypeHighlightCodeBlock = require('..');

describe('rehypeHighlightCodeBlock', () => {
  let mockHighlightSpy;
  let processHtml;

  beforeEach(() => {
    mockHighlightSpy = jest.fn(() => '<span>mockSyntaxHighlighting</span>');
    processHtml = html => {
      return rehype()
        .data('settings', { fragment: true })
        .use(rehypeHighlightCodeBlock, {
          highlight: mockHighlightSpy
        })
        .processSync(html)
        .toString();
    };
  });

  test('mocks syntax highlighting with language-* class', () => {
    const result = processHtml(dedent`
      <div>
        <p>foo</p>
        <pre><code class="language-css">p { color: red }</code></pre>
        <p>bar</p>
      </div>
    `);
    expect(mockHighlightSpy).toHaveBeenCalledWith(`p { color: red }`, 'css');
    expect(result).toMatchSnapshot();
  });

  test('mocks syntax highlighting with lang-* class', () => {
    const result = processHtml(dedent`
      <div>
        <p>foo</p>
        <pre><code class="lang-css">p { color: red }</code></pre>
        <p>bar</p>
      </div>
    `);
    expect(mockHighlightSpy).toHaveBeenCalledWith(`p { color: red }`, 'css');
    expect(result).toMatchSnapshot();
  });

  test('mocks syntax highlighting with no language class', () => {
    const result = processHtml(dedent`
      <div>
        <p>foo</p>
        <pre><code>p { color: red }</code></pre>
        <p>bar</p>
      </div>
    `);
    expect(mockHighlightSpy).toHaveBeenCalledWith(`p { color: red }`, null);
    expect(result).toMatchSnapshot();
  });

  test('does nothing to code block, missing <pre></pre>', () => {
    const result = processHtml(dedent`
      <code>p { color: red }</code>
    `);
    expect(mockHighlightSpy).toHaveBeenCalledTimes(0);
    expect(result).toMatchSnapshot();
  });

  test('does nothing to code block, missing <code></code>', () => {
    const result = processHtml(dedent`
      <pre>p { color: red }</pre>
    `);
    expect(mockHighlightSpy).toHaveBeenCalledTimes(0);
    expect(result).toMatchSnapshot();
  });

  test('does nothing to code block, missing pre > code', () => {
    const result = processHtml(dedent`
      <div>p { color: red }</div>
    `);
    expect(mockHighlightSpy).toHaveBeenCalledTimes(0);
    expect(result).toMatchSnapshot();
  });
});
