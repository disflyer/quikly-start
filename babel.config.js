module.exports = function override(api) {
  // var env = api.cache(() => process.env.NODE_ENV)
  const isProd = api.cache(() => process.env.NODE_ENV === 'production')

  const plugins = [
    // '@babel/plugin-transform-typescript',
    // '@babel/plugin-proposal-optional-chaining'
    // 'babel-plugin-macros'
  ]

  if (isProd) {
    plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }])
  }

  return {
    presets: [
      '@babel/preset-typescript',
      [
        'next/babel',
        {
          'preset-env': {},
          'transform-runtime': {},
          'styled-jsx': {},
          'class-properties': {}
        }
      ],
      'linaria/babel'
    ],
    plugins
  }
}
