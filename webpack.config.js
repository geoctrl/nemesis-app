const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IcosetWebpackPlugin = require('@icoset/icoset-webpack-plugin');
const Fiber = require('fibers');

const icons = require('./icons');

const config = {};
config.entry = path.resolve(__dirname, 'src/index.js');
config.output = {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'build/'),
  publicPath: '/',
};

config.devtool = 'source-map';

config.module = {
  rules: [
    {
      test: /\.js/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
    {
      test: /\.scss$/,
      exclude: [/node_modules/, /main\.scss$/],
      use: [
        'kremling-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require("sass"),
            fiber: Fiber,
          },
        },
      ],
    },
    {
      test: /main\.scss$/,
      exclude: /node_modules/,
      use: ['style-loader', 'css-loader', {
        loader: 'sass-loader',
        options: {
          implementation: require("sass"),
          fiber: Fiber,
        },
      }],
    },
    {
      test: /\.svg$/,
      exclude: /node_modules/,
      use: 'raw-loader',
    },
    {
      test: /\.(png|gif)$/i,
      exclude: /node_modules/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 500000,
          },
        },
      ],
    },
    {
      test: /\.mp3$/,
      exclude: /node_moduels/,
      use: 'file-loader',
    },
  ],
};

config.plugins = [
  new IcosetWebpackPlugin({
    directory: path.resolve(
      __dirname,
      'node_modules/@fortawesome/fontawesome-pro/svgs'
    ),
    icons,
  }),

  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
  }),
];

config.devServer = {
  index: 'index.html',
  contentBase: path.resolve(__dirname, 'src'),
  historyApiFallback: true,
  port: 8080,
};

module.exports = config;
