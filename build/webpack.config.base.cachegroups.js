const subpackageNames = [
  'card',
  'paidcontent',
  'shop',
  'trade',
  'ump',
  'user'
]

const groups = {
  commons: {
    name: 'commons',
    chunks: 'initial',
    minSize: 0,
    minChunks: 2,
    priority: 1,
    maxInitialRequests: 10
  },
  vendors: {
    test: /[\\/]node_modules[\\/]/,
    name: 'vendors',
    chunks: 'all',
    maxInitialRequests: 10,
    priority: 1
  },

  showcaseCommons: {
    name: 'showcase',
    test: (module) => /\.js$/.test(module.resource) && (
      /components\/showcase/.test(module.resource) ||
      /node_modules\/@youzan\/feature-adaptor/.test(module.resource)
    ),
    chunks: 'all',
    minSize: 0,
    minChunks: 1,
    priority: 3
  }
}

module.exports = groups