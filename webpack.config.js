/* eslint-disable */
const path = require('path');
const fs = require("fs");
const HtmlWebPackPlugin = require('html-webpack-plugin');

const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join('styles', './ant-theme-vars.less'), 'utf8'));

const index = new HtmlWebPackPlugin(
    {
        template: "./src/index.html",
        filename: "./index.html"
    }
);

const optimization = {
    splitChunks: {
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                chunks: 'all',
                minChunks: 1,
                maxInitialRequests: 5,
                minSize: 0,
                reuseExistingChunk: true
            },
            commons: {
                name: 'commons',
                chunks: 'initial',
                minChunks: 2
            },
            styles: {
                name: 'styles',
                test: /\.css$/,
                chunks: 'all',
                enforce: true
            }
        }
    }
};

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.less$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "less-loader",
                        options: {
                            modifyVars: themeVariables,
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        function () {
            // When webpack has finished
            this.plugin("done", function (stats) {
                // try and find the dist folder
                var wpPath = path.join(__dirname, "dist");
                if (fs.existsSync(wpPath) === false) {
                    // If it doesn't exist, create it
                    fs.mkdirSync(wpPath);
                }
                // write the stats.json file to the Webpack folder
                fs.writeFileSync(
                    path.join(wpPath, "stats.json"),
                    JSON.stringify(stats.toJson()));
            });
        },
        index
    ],
    optimization: optimization,
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*" },
        historyApiFallback: true
    }
}

module.exports = config;