import fs from 'node:fs';
import path from 'path';
import pugLex from 'pug-lexer';
import { optimize } from 'svgo';

const extractContextsSvgPaths = (tokens) => {
  return tokens
    .filter((token) => {
      return (
        token.type === 'attribute' &&
        ((token.name === 'd' && !token.val.includes('path')) ||
          token.name === 'title')
      );
    })
    .map((token, i, tokens) => {
      const prevToken = i === 0 ? { type: null, name: null } : tokens[i - 1];
      if (
        token.type === 'attribute' &&
        token.name === 'd' &&
        prevToken.type === 'attribute' &&
        prevToken.name === 'title'
      ) {
        return [
          prevToken.val.substring(1, prevToken.val.length - 1), // title
          token.val.substring(1, token.val.length - 1), // path
        ];
      }
    })
    .filter(Boolean);
};

describe('Embedded assets optimization', () => {
  const indexFilePath = path.join('public', 'index.pug');
  const indexFileContent = fs.readFileSync(indexFilePath, 'utf8');
  const contextsSvgPaths = extractContextsSvgPaths(pugLex(indexFileContent));

  it.each(contextsSvgPaths)(
    '%p icon path is optimized with SVGO',
    (title, path) => {
      const svg = `<svg><path d="${path}"/></svg>`;
      expect(svg).toEqual(optimize(svg).data);
    },
  );
});
