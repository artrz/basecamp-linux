module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  settings: {
    'import/core-modules': [
      'electron',
    ],
  },
};
