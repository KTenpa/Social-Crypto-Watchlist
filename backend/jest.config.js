module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./setupTests.js'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/config/',
      '/__tests__/',
      '/models/User.js' // Ignore the auto-init script
    ],
  };
  