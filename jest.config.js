module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  testTimeout: 30000
}; 