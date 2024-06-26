/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000,
  //testRegex: "__tests__/.*.e2e.test.ts$",
  testRegex: "__tests__/e2e/.*\\.e2e\\.test\\.ts$", //работает и без экранирования \\
};