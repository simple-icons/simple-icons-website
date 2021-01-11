const fs = require('fs');
const path = require('path');
const { format: printf } = require('util');

// Extensions that are supported.
const EXTENSIONS_CSS = ['.css'];
const EXTENSIONS_HTML = ['.html'];
const EXTENSIONS_JS = ['.js'];
const EXTENSIONS_SUPPORTED = EXTENSIONS_CSS.concat(EXTENSIONS_HTML).concat(EXTENSIONS_JS);

// (Regular) Expressions used for mangling
const EXPRESSIONS_CLASS_CSS = [
  // e.g.
  //  .(foo)
  //  .(foo)({)
  //  .(foo)( ){
  //  .(foo)(.)bar {
  //  .(foo)(#)bar {
  //  .(foo)([)data-value] {
  //  .(foo)(:)focus {
  //  .(foo)(:):before {
  '\\.(%s)([\{\\s\.\#\[\:])',
];
const EXPRESSIONS_CLASS_HTML = [
  /* Single quotes */

  // e.g.
  //  class=(')(foo)(')
  //  class= (')(foo)(')
  //  class =(')(foo)(')
  //  class = (')(foo)(')
  'class\\s*=\\s*(\')(%s)(\')',

  // e.g.
  //  class=(')(foo)( b')
  //  class= (')(foo)( b')
  //  class =(')(foo)( b')
  //  class = (')(foo)( b')
  'class\\s*=\\s*(\')(%s)(\\s[^\']*\')',

  // e.g.
  //  class=('a )(foo)(')
  //  class= ('a )(foo)(')
  //  class =('a )(foo)(')
  //  class = ('a )(foo)(')
  'class\\s*=\\s*(\'[^\']*\\s)(%s)(\')',

  // e.g.
  //  class=('a )(foo)( b')
  //  class= ('a )(foo)( b')
  //  class =('a )(foo)( b')
  //  class = ('a )(foo)( b')
  'class\\s*=\\s*(\'[^\']*\\s)(%s)(\\s[^\']*\')',

  /* Double quotes */

  // e.g.
  //  class=(")(foo)(")
  //  class= (")(foo)(")
  //  class =(")(foo)(")
  //  class = (")(foo)(")
  'class\\s*=\\s*(")(%s)(")',

  // e.g.
  //  class=(")(foo)( b")
  //  class= (")(foo)( b")
  //  class =(")(foo)( b")
  //  class = (")(foo)( b")
  'class\\s*=\\s*(")(%s)(\\s[^"]*")',

  // e.g.
  //  class=("a )(foo)(")
  //  class= ("a )(foo)(")
  //  class =("a )(foo)(")
  //  class = ("a )(foo)(")
  'class\\s*=\\s*("[^"]*\\s)(%s)(")',

  // e.g.
  //  class=("a )(foo)( b")
  //  class= ("a )(foo)( b")
  //  class =("a )(foo)( b")
  //  class = ("a )(foo)( b")
  'class\\s*=\\s*("[^"]*\\s)(%s)(\\s[^"]*")',
];
const allowedLeadingJs = '\\.?';
const allowedTrailingJs = '\\s\.\#\[';
const EXPRESSIONS_CLASS_JS = [
  /* Single quotes */

  // e.g.
  //  (')(foo)(')
  //  (')(foo)(.)bar
  //  (')(foo)(#)bar
  //  (')(foo)([]data-value]
  //  ('.)(foo)(')
  //  ('.)(foo)(.)bar
  //  ('.)(foo)(#)bar
  //  ('.)(foo)([]data-value]
  `('${allowedLeadingJs})(%s)(['${allowedTrailingJs}])`,

  // e.g.
  //  ('a )(foo)(')
  //  ('a )(foo)(.)bar
  //  ('a )(foo)(#)bar
  //  ('a )(foo)([]data-value]
  //  ('a .)(foo)(')
  //  ('a .)(foo)(.)bar
  //  ('a .)(foo)(#)bar
  //  ('a .)(foo)([]data-value]
  `('[^']*\\s${allowedLeadingJs})(%s)(['${allowedTrailingJs}])`,

  /* Double quotes */

  // e.g.
  //  (")(foo)(")
  //  (")(foo)(.)bar
  //  (")(foo)(#)bar
  //  (")(foo)([]data-value]
  //  (".)(foo)(")
  //  (".)(foo)(.)bar
  //  (".)(foo)(#)bar
  //  (".)(foo)([]data-value]
  `("${allowedLeadingJs})(%s)(["${allowedTrailingJs}])`,

  // e.g.
  //  ("a )(foo)(")
  //  ("a )(foo)(.)bar
  //  ("a )(foo)(#)bar
  //  ("a )(foo)([]data-value]
  //  ("a .)(foo)(")
  //  ("a .)(foo)(.)bar
  //  ("a .)(foo)(#)bar
  //  ("a .)(foo)([]data-value]
  `("[^"]*\\s${allowedLeadingJs})(%s)(["${allowedTrailingJs}])`,

  /* Backticks */

  // e.g.
  //  (`)(foo)(`)
  //  (`)(foo)(.)bar
  //  (`)(foo)(#)bar
  //  (`)(foo)([]data-value]
  //  (`.)(foo)(`)
  //  (`.)(foo)(.)bar
  //  (`.)(foo)(#)bar
  //  (`.)(foo)([]data-value]
  `(\`${allowedLeadingJs})(%s)([\`${allowedTrailingJs}])`,

  // e.g.
  //  (`a )(foo)(`)
  //  (`a )(foo)(.)bar
  //  (`a )(foo)(#)bar
  //  (`a )(foo)([]data-value]
  //  (`a .)(foo)(`)
  //  (`a .)(foo)(.)bar
  //  (`a .)(foo)(#)bar
  //  (`a .)(foo)([]data-value]
  `(\`[^\`]*\\s${allowedLeadingJs})(%s)([\`${allowedTrailingJs}])`,
];

/**
 * Create a new mangled class name generator. This generator will generate
 * the shortest, safe, unique string not previously generated.
 *
 * @example
 *   const generator = new NameGenerator([]);
 *   const firstName = generate.nextName();
 *   console.log(firstName); // outputs "a"
 *
 * @param {String[]} reservedNames Names that should not be generated.
 * @returns The generator, used by calling `.nextName()`.
 */
function NameGenerator(reservedNames) {
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

      const name = currentName.join('');
      if (reservedNames.includes(name)) {
        return this.nextName();
      } else {
        return name;
      }
    },
  };
}

/**
 * Get a count of all occurrences of all classes matching `opts.classNameExpr`
 * in `opts.files` combined.
 *
 * @param {Object} opts The mangler options. Needs `files` and `classNameExpr`.
 * @returns {Map<String, Integer>} The count for each class.
 */
function getClassCount(opts) {
  const x = (s) => printf(s, opts.classNameExpr);

  const countMap = new Map();
  for (const file of opts.files) {
    const extension = path.extname(file);

    let rawExprs, matchIndex;
    if (EXTENSIONS_CSS.includes(extension)) {
      rawExprs = EXPRESSIONS_CLASS_CSS.map(x);
      matchIndex = 1;
    } else if (EXTENSIONS_HTML.includes(extension)) {
      rawExprs = EXPRESSIONS_CLASS_HTML.map(x);
      matchIndex = 2;
    } else if (EXTENSIONS_JS.includes(extension)) {
      rawExprs = EXPRESSIONS_CLASS_JS.map(x);
      matchIndex = 2;
    } else {
      console.log(`unsupported file type ${extension}`)
      continue;
    }

    const s = fs.readFileSync(file).toString();
    for (const rawExpr of rawExprs) {
      const expr = new RegExp(rawExpr, 'gm');
      while (match = expr.exec(s)) {
        const className = match[matchIndex];
        const count = countMap.get(className) || 0;
        countMap.set(className, count + 1);
      }
    }
  }

  return countMap;
}

/**
 * Get a CSS mangling map based on the number of times each class occurs.
 *
 * @param {Object} opts The mangler options. Needs `reservedClassNames`.
 * @param {Map<String, Integer>} countMap The occurrence count of each class.
 * @returns {Map<String, String>} A map defining the CSS mangling.
 */
function getMangleMap(opts, countMap) {
  const entries = Array.from(countMap.entries());
  const mostToLeastCommon = entries.sort((a, b) => b[1] - a[1]).map(e => e[0]);

  const nameGenerator = new NameGenerator(opts.reservedClassNames);
  const mangleMap = new Map();
  for (const oldClassName of mostToLeastCommon) {
    const newClassName = nameGenerator.nextName();
    mangleMap.set(oldClassName, newClassName);
  }

  return mangleMap;
}

/**
 * Mangle the string `s` using the `extension`'s syntax using the `mapping`.
 *
 * @param {String} s
 * @param {String} extension
 * @param {Map<String, String>} mapping The mangling map.
 */
function doMangle(s, extension, mapping) {
  for (const [from, to] of mapping) {
    const x = (s) => printf(s, from);

    let rawExprs, repl;
    if (EXTENSIONS_CSS.includes(extension)) {
      rawExprs = EXPRESSIONS_CLASS_CSS.map(x)
      repl = `.${to}$2`;
    } else if (EXTENSIONS_HTML.includes(extension)) {
      rawExprs = EXPRESSIONS_CLASS_HTML.map(x);
      repl = `class=$1${to}$3`;
    } else if (EXTENSIONS_JS.includes(extension)) {
      rawExprs = EXPRESSIONS_CLASS_JS.map(x);
      repl = `$1${to}$3`;
    } else {
      console.log(`unsupported file type ${extension}`)
      continue;
    }

    for (const rawExpr of rawExprs) {
      const expr = new RegExp(rawExpr, 'g');
      s = s.replace(expr, repl);
    }
  }

  return s;
}

/**
 * Mangle the given `files` using the given mangle `mapping`.
 *
 * @param {String[]} files The files to mangle on.
 * @param {Map<String, String>} mapping The mangling map.
 */
function doMangleOn(files, mapping) {
  for (const file of files) {
    const extension = path.extname(file);
    if (!EXTENSIONS_SUPPORTED.includes(extension)) {
      console.log(`unsupported file type ${extension} (${file})`);
      continue;
    }

    const inString = fs.readFileSync(file).toString();
    const outString = doMangle(inString, extension, mapping);

    console.log(`writing ${file}`);
    fs.writeFileSync(file, outString);
  }
}

/**
 *
 * @param {*} opts
 */
function main(opts) {
  const countMap = getClassCount(opts);
  const mangleMap = getMangleMap(opts, countMap);
  doMangleOn(opts.files, mangleMap);
}

main({
  classNameExpr: '(grid)-[a-z][a-zA-Z0-9_\-]*',
  reservedClassNames: ['fa', 'si'],
  files: [
    './_site/app.css',
    './_site/index.html',
    './_site/script.js',
  ],
});
