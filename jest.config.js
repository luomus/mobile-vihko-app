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
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
}