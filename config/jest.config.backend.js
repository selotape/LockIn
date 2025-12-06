module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit/backend'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/backend/(.*)$': '<rootDir>/src/backend/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  collectCoverageFrom: [
    'src/backend/**/*.ts',
    '!src/backend/**/*.d.ts',
    '!src/backend/server.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
