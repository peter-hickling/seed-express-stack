const path = require('path')

module.exports = ['source-map'].map(devtool => ({
  target: 'node',
  mode: 'production',
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.ts'],
  },
  entry: './src/server.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    library: 'server',
    libraryTarget: 'umd',
  },
  devtool,
  optimization: {
    runtimeChunk: true,
  },
  externals: {
    express: {
      commonjs: 'express',
      commonjs2: 'express',
      amd: 'express',
      root: '_',
    },
    'express-http-context': {
      commonjs: 'express-http-context',
      commonjs2: 'express-http-context',
      amd: 'express-http-context',
      root: '_',
    },
    passport: {
      commonjs: 'passport',
      commonjs2: 'passport',
      amd: 'passport',
      root: '_',
    },
  },
}))
