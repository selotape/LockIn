module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/unit/frontend'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/frontend/(.*)$': '<rootDir>/src/frontend/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  collectCoverageFrom: [
    'src/frontend/**/*.ts',
    '!src/frontend/**/*.d.ts',
    '!src/frontend/main.ts'
  ]
};
