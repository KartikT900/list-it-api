module.exports = {
  preset: 'ts-jest',
  modulePaths: ['<rootDir>/src'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/(config|public)/'
  ],
  testRegex: '((\\.|/)(test|spec))\\.ts?$',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.*', '!**/**/*.json'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    './prisma',
    './config',
    './coverage',
    '.config.(t|j)s',
    '.eslintrc.cjs',
    '<rootDir>/src/index.ts',
    './public'
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTest.ts'],
  coverageReporters: ['html'],
  testEnvironment: 'node'
};