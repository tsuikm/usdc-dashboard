module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  rootDir: './',
  moduleNameMapper: {
    '^web3$': '<rootDir>/src/utils/web3mock',
  },
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
};
