const path = require('path');

const fileLoader = name => ({
  loader: 'file-loader',
  options: {
    publicPath: '',
    context: path.resolve(__dirname, '../expample'),
    name
  }
});

module.exports = [
  {
    test: /\.js$/,
    include: path.resolve(__dirname, '../expample'),
    exclude: path.resolve(__dirname, '../node_modules'),
    use: [
      'babel-loader',
    ],
  },
  {
    test: /.wxml/,
    use: [
      fileLoader('[path][name].[ext]'),
      'mini-program-webpack-loader',
    ]
  },
  {
    test: /\.wxss$/,
    use: [
      fileLoader('[path][name].[ext]'),
      'mini-program-webpack-loader',
    ]
  },
  {
    test: /\.json/,
    type: 'javascript/auto',
    use: [
      fileLoader('[path][name].[ext]'),
      'mini-program-webpack-loader'
    ]
  },
  {
    test: /\.(png|jpg|gif)$/,
    include: /expample/,
    use: fileLoader('[path][name].[ext]')
  }
];
