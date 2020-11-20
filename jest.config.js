module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  rootDir: './',
  moduleNameMapper: {
    '^web3$': '<rootDir>/tests/web3mock',
  },
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
};
