module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], 'babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      [
        'module:react-native-dotenv', {
          'moduleName': 'react-native-dotenv'
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
