module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};