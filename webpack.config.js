const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_env, options) => ({
  mode: 'development',
  devtool: options.mode === 'development' ? 'source-map' : false,
  target: 'web',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'js/[hash].js',
    environment: {
      arrowFunction: false,
      const: false,
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      Images: './src/images/',
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ['babel-loader', {
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
          },
        }],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          outputPath: 'images',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new MiniCssExtractPlugin({
      filename: 'css/[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),
  ],
  optimization: {
    minimize: options.mode === 'production',
    minimizer: [
      new UglifyJsPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: './',
    overlay: true,
    watchContentBase: true,
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    inline: true,
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
  },
});
