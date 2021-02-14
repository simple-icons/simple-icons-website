const { BuiltInLanguagesSupport } = require('webmangler/languages');
const { BuiltInManglers } = require('webmangler/manglers');

module.exports = {
  plugins: [
    new BuiltInManglers({
      // CSS class mangling
      classNamePattern: [
        // section-related classes
        '(header|main|footer)[_-]?[a-zA-Z0-9_-]*',

        // grid-related classes
        'grid-?[a-zA-Z0-9_-]*',

        // control-related classes
        '(control|search)-?[a-zA-Z0-9_-]*',

        // .order-by-xxx
        '(order-by)-[a-zA-Z0-9_-]+',

        // .dark-mode and .light-mode
        '(dark|light)-mode',
        'contrast-(dark|light)',

        // Miscellaneous
        '(hidden|no-js|copied|copy-button)',
      ],

      // CSS variable mangling
      cssVarNamePattern: '[a-zA-Z0-9\\-]*',

      // Attribute mangling
      attrNamePattern: 'data-[a-zA-Z0-9\\-]*',
      keepAttrPrefix: 'data-',

      // ID mangling
      idNamePattern: [
        // mostly button IDs
        'id-[a-zA-Z0-9-]+',

        // IDs for <svg>s
        '[a-zA-Z0-9-_]+-svg',
      ],
    }),
  ],
  languages: [new BuiltInLanguagesSupport()],
};
