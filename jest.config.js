module.exports = {
  preset: 'react-native',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@sentry/react-native|native-base)'
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