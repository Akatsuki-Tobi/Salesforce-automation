module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/__tests__/**/*.(mjs|mts|js|ts|jsx|tsx|spec.js)',
  ],
};