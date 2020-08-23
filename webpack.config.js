const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './dist',
  },
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(vert|frag)$/,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
