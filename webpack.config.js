const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Webpack = require('webpack');

const path = require('path');

module.exports = (data) => {
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      modules: ['src', 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: /node_modules/,
        },
        {
          test: /.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                additionalData: `$mainColor: ${data.mainColor};`,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          use: ['file-loader?name=assets/[name].[ext]'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new Webpack.DefinePlugin({
        processEnv: {
          mainColor: JSON.stringify(data.mainColor),
          name: JSON.stringify(data.name),
          description: JSON.stringify(data.description),
          avatar: JSON.stringify(data.avatar),
          socketUrl: JSON.stringify(data.socketUrl),
          restUrl: JSON.stringify(data.restUrl),
        },
      }),
    ],
  };
};
