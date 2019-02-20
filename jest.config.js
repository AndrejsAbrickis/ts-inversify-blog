module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ['**/test/**/?(*.)(spec|test).(ts|js)?(x)'],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}