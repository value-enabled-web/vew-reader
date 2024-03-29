module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  semi: false,
  importOrderSeparation: true,
  importOrder: [
    '^(react|react-native)$',
    '^react-native$',
    '<THIRD_PARTY_MODULES>',
    '^[.]',
  ],
}
