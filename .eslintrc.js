module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'browser': true,
    'es6': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'no-case-declarations': 'off',
    'no-undef': 'off',
    'react/prop-types': 0,
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'no-const-assign': 'error',
    'no-console': 0,
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'comma-spacing': [
      'error', { 'before': false, 'after': true }
    ],
    'keyword-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'key-spacing': [
      'error'
    ],
    'space-infix-ops': [
      'error'
    ]
  },
  'settings': {
    'react': {
      'createClass': 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      'pragma': 'React',  // Pragma to use, default to "React"
      'fragment': 'Fragment',  // Fragment to use (may be a property of <pragma>), default to "Fragment"
      'version': 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      'flowVersion': '0.53' // Flow version
    },
    'propWrapperFunctions': [
    // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      { 'property': 'freeze', 'object': 'Object' },
      { 'property': 'myFavoriteWrapper' }
    ],
    'linkComponents': [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      { 'name': 'Link', 'linkAttribute': 'to' }
    ]
  }
}
