const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require("path");

const config = {
  entry: ["./src/js/App.ts"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Ensures the output directory is cleaned before each build
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: {
    jquery: "jQuery",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
        include: [path.resolve(__dirname, "src/js")],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource', // Webpack's native asset handling
        generator: {
          filename: 'img/[hash][ext][query]', // Output images to 'img/' folder
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/img"), // Source folder
          to: path.resolve(__dirname, "dist/img"),  // Destination folder
        },
      ],
    }),
  ],
  mode: "development",
};

module.exports = config;
