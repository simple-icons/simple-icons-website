import fs from 'node:fs';
import path from 'node:path';
import pugLex from 'pug-lexer';
import {optimize} from 'svgo';

const extractContextsSvgPaths = (tokens) => {
  return tokens
    .filter((token) => {
      return (
        token.type === 'attribute' &&
        ((token.name === 'd' && !token.val.includes('path')) ||
          token.name === 'title')
      );
    })
    .map((token, i, tokens_) => {
      const previousToken = i === 0 ? {type: null, name: null} : tokens_[i - 1];
      if (
        token.type === 'attribute' &&
        token.name === 'd' &&
        previousToken.type === 'attribute' &&
        previousToken.name === 'title'
      ) {
        return [
          // Title, path
          previousToken.val.slice(1, -1),
          token.val.slice(1, -1),
        ];
      }

      return undefined;
    })
    .filter(Boolean);
};

describe('Embedded assets optimization', () => {
  const indexFilePath = path.join('public', 'index.pug');
  const indexFileContent = fs.readFileSync(indexFilePath, 'utf8');
  const contextsSvgPaths = extractContextsSvgPaths(pugLex(indexFileContent));

  it.each(contextsSvgPaths)(
    '%p icon path is optimized with SVGO',
    (title, d) => {
      const svg = `<svg><path d="${d}"/></svg>`;
      expect(svg).toEqual(optimize(svg).data);
    },
  );
});
