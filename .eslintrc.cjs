/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  globals: {
    shopify: "readonly"
  },
  rules: {
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/jsx-boolean-value': 'error',
    'prefer-template': "error",
    'jsx-quotes': ["error", "prefer-double"],
    "react/jsx-tag-spacing": "error",
    'react/prop-types': 'off',
    'react/jsx-curly-brace-presence': 'error',
  },
};
