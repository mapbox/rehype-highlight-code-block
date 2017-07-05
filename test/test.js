'use strict';

const rehype = require('rehype');
const dedent = require('dedent');
const rehypeHighlightCodeBlock = require('..');

describe('rehypeHighlightCodeBlock', () => {
  let mockHighLightSpy;
  let processHtml;

  beforeEach(() => {
    mockHighLightSpy = jest.fn(() => '<span>mockSyntaxHighlighting</span>');
    processHtml = html => {
      return rehype()
        .data('settings', { fragment: true })
        .use(rehypeHighlightCodeBlock, {
          highlight: mockHighLightSpy
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
    expect(mockHighLightSpy.mock.calls[0].length).toBe(2);
    expect(mockHighLightSpy.mock.calls[0][1]).toBe('css');
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
    expect(mockHighLightSpy.mock.calls[0].length).toBe(2);
    expect(mockHighLightSpy.mock.calls[0][1]).toBe('css');
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
    expect(mockHighLightSpy.mock.calls[0].length).toBe(2);
    expect(mockHighLightSpy.mock.calls[0][1]).toBe(null);
    expect(result).toMatchSnapshot();
  });

  test('does nothing to code block, missing <pre></pre>', () => {
    const result = processHtml(dedent`
      <code>p { color: red }</code>
    `);
    expect(mockHighLightSpy.mock.calls.length).toBe(0);
    expect(result).toMatchSnapshot();
  });

  test('does nothing to code block, missing <code></code>', () => {
    const result = processHtml(dedent`
      <pre>p { color: red }</pre>
    `);
    expect(mockHighLightSpy.mock.calls.length).toBe(0);
    expect(result).toMatchSnapshot();
  });

  test('does nothing to code block, missing pre > code', () => {
    const result = processHtml(dedent`
      <div>p { color: red }</div>
    `);
    expect(mockHighLightSpy.mock.calls.length).toBe(0);
    expect(result).toMatchSnapshot();
  });
});
