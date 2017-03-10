const path = require('path')

module.exports = {
  entry: './src/App.jsx',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'react-hot-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react']
            }
          }
        ]
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!stylus-loader'
      }
    ]
  },

  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },

  devtool: 'cheap-eval-source-map',

  resolve: {
    extensions: ['.js', '.jsx', '.json', '*']
  }
}
