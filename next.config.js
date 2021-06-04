const isProd = process.env.NODE_ENV === 'production'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map'
})
const withLinaria = require('./nextWithLinaria')
const withImages = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const { isServer } = options
      nextConfig = Object.assign({ inlineImageLimit: 8192, assetPrefix: '' }, nextConfig)

      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }

      config.module.rules.push({
        test: /\.(jpe?g|png|svg|gif|ico|webp|jp2)$/,
        exclude: nextConfig.exclude,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: nextConfig.inlineImageLimit,
              fallback: require.resolve('file-loader'),
              publicPath: `${nextConfig.assetPrefix}/_next/static/images/`,
              outputPath: `${isServer ? '../' : ''}static/images/`,
              name: '[name]-[hash].[ext]',
              esModule: nextConfig.esModule || false
            }
          }
        ]
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}

const withFonts = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const { isServer } = options
      nextConfig = Object.assign({ inlineImageLimit: 8192, assetPrefix: '' }, nextConfig)

      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }

      config.module.rules.push({
        test: /\.(eot|woff|woff2|ttf)$/,
        exclude: nextConfig.exclude,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: require.resolve('file-loader'),
              publicPath: `${nextConfig.assetPrefix}/_next/static/fonts/`,
              outputPath: `${isServer ? '../' : ''}static/fonts/`,
              name: '[name]-[hash].[ext]',
              esModule: nextConfig.esModule || false
            }
          }
        ]
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}

module.exports = withBundleAnalyzer(
  withFonts(
    withImages(
      withSourceMaps(
        withLinaria({
          env: {
            APP_ENV: process.env.APP_ENV
          },
          future: {
            webpack5: true
          },
          esModule: true,
          // async redirects() {
          //   return [
          //     {
          //       source: '/',
          //       destination: '/',
          //       permanent: false
          //     }
          //   ]
          // },
          // assetPrefix: isProd ? `https://static.codefuture.top/${pkg.keke.prefix}` : '',
          inlineImageLimit: 1000,
          webpack(config, options) {
            const { dev } = options
            if (dev) {
              config.module.rules.push({
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
              })
            }
            config.module.rules.push({
              test: /\.js$/,
              exclude: /[\\/]node_modules[\\/](?!(react-spring|react-hook-form)[\\/])/,
              use: [options.defaultLoaders.babel]
            })

            return config
          }
        })
      )
    )
  )
)
