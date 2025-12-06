const jestPreset = require('jest-expo/jest-preset');

module.exports = {
  ...jestPreset,
  setupFilesAfterEnv: [
    ...(jestPreset.setupFilesAfterEnv || []),
    '<rootDir>/jest.setup.js',
  ],
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
