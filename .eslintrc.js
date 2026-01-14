module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 7,
    sourceType: "module",
    parser: "babel-eslint"
  },
  parser: "vue-eslint-parser",
  // required to lint *.vue files
  plugins: ["html"],
  rules: {
    "no-console": "off",
    "space-before-function-paren": 0
  }
};
