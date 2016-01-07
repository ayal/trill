var webpack = require('webpack');
var path  =require('path');

module.exports = {
    entry: [
      "./script.js"
    ],
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    module: {
        loaders: [
	    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
	    { test: /\.less$/, loader: "style-loader!css-loader!less-loader"}
            
        ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]

};
