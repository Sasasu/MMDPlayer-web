module.exports = {
    entry: {
        index: __dirname + '/src/index.ts',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            'test': /\.ts?$/,
            'loaders': ['ts-loader']
        }, {
            'test': /\.js?$/,
            'loaders': ['babel-loader']
        }, {
            'test': require.resolve('three'),
            loader: "imports-loader?this=>window"
        }
        ]
    },
}