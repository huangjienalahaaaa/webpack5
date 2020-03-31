/* 其他配置
 */
const {
    resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

process.env.NODE_ENV = "production";

const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            plugins: () => [require("postcss-preset-env")()]
        }
    }
];

module.exports = {
    entry: ["./src/js/index.js"],
    output: {
        filename: "js/[name].[contenthash:10].js",
        path: resolve(__dirname, "build")
    },
    module: {
        rules: [{
            // { //eslint语法检查
            //   test: /\.js$/,
            //   exclude: /node_modules/,
            //   loader: "eslint-loader",
            //   enforce: 'pre',
            //   options: {
            //     fix: true
            //   }
            // },
            oneOf: [{
                    test: /\.css$/,
                    use: [...commonCssLoader]
                },
                {
                    test: /\.less$/,
                    use: [...commonCssLoader, "less-loader"]
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    loader: "url-loader",
                    options: {
                        limit: 8 * 1024,
                        esModule: false,
                        name: "[hash:10].[ext]",
                        outputPath: "imgs"
                    }
                },
                {
                    test: /\.html$/,
                    loader: "html-loader"
                },
                {
                    exclude: /\.(css|js|html|less|jpg|png|gif)$/,
                    loader: "file-loader",
                    options: {
                        name: "[hash:10].[ext]",
                        outputPath: "media"
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [{

                            loader: "thread-loader",
                            options: {
                                workers: 2
                            }
                        },
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    [
                                        "@babel/preset-env",
                                        {
                                            useBuiltIns: "usage",

                                            corejs: {
                                                version: 3
                                            },

                                            targets: {
                                                chrome: "60",
                                                firefox: "60",
                                                ie: "9",
                                                safari: "10",
                                                edge: "17"
                                            }
                                        }
                                    ]
                                ],
                                cacheDirectory: true
                            }
                        }
                    ]
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/build.[contenthash:10].css"
        }),
        new OptimizeCssAssetsPlugin(),
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, "dll/manifest.json")
        }),
        new AddAssetHtmlPlugin({
            filepath: resolve(__dirname, 'dll/jquery.js')
        })
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },

    mode: "production",
    externals: {
        jquery: "jQuery"
    },

    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        open: true,
        port: 3000,
        hot: true
    },
    devtool: "source-map"
};