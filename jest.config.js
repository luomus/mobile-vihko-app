module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  },
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@sentry/react-native|native-base|react-redux)'
  ],
  modulePathIgnorePatterns: [
    '.*__mocks__.*'
  ]
  // collectCoverage: true,
  // collectCoverageFrom: [
  //     "**/*.{js,jsx}",
  //     "!**/coverage/**",
  //     "!**/node_modules/**",
  //     "!**/babel.config.js",
  //     "!**/jest.setup.js"
  // ],
}