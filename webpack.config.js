const path = require(`path`);
const NodeExternals = require(`webpack-node-externals`);

module.exports = {
  cache: true,
  context: path.join(__dirname, `src`),
  entry: [`long`,`.`],
  output: {
    filename: `server.js`,
    path: path.join(__dirname, `dist`),
  },
  target: `node`,
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  externals: [
    NodeExternals(),
  ],
  resolve: {
    extensions: [`.ts`,`.js`]
  }
};
