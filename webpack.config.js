module.exports = {
  entry: './app/app.js',
  output: {
    path: __dirname + '/static',
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    contentBase: './static',
    port: 1298,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  }
}
