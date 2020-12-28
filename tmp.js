const fs = require('fs');

function newNameGenerator() {
  let currentName = ['.'];

  const charSet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return {
    nextName: function() {
      const lastChar = currentName[currentName.length - 1];
      if (lastChar === charSet[charSet.length - 1]) {
        currentName.push(charSet[0]);
      } else {
        currentName[currentName.length - 1] = charSet[charSet.indexOf(lastChar) + 1];
      }

      return currentName.join('');
    }
  }
}

// https://github.com/sndyuk/mangle-css-class-webpack-plugin/blob/master/lib/optimizer.js

function main(opts) {
  const nameGenerator = newNameGenerator();
  const mapping = new Map();

  // if (file.match(/.+\.css.*$/)) {
  let regexp = new RegExp(`\\\.(${opts.classNameRegExp})`, 'g');
  // } else if (file.match(/.+\.js.*$/) || file.match(/.+\.html.*$/)) {
  //   classnameRegex = new RegExp(`["'.\\\s](${opts.classNameRegExp})`, 'g');
  // }


  const rawSource = fs.readFileSync('./_site/app.css').toString();
  while (match = regexp.exec(rawSource)) {
    const originalName = match[1];
    console.log(originalName)
    let replacementName = mapping.get(originalName)
    if (replacementName === undefined) {
      replacementName = nameGenerator.nextName();
      mapping.set(originalName, replacementName);
    }
  }

  let out = rawSource;
  for (const [from, to] of mapping) {
    const fromRegex = new RegExp(`\.${from}([\\s\:\{])`, 'g');
    out = out.replace(fromRegex, `.${to}$1`);
  }
  console.log(out);

}


main({
  classNameRegExp: '(grid)-[a-z][a-zA-Z0-9_\-]*',
});
