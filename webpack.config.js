const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
// require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });
require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || "local"}`),
});

// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("REACT_APP_API_BASE_URL:", process.env.REACT_APP_API_BASE_URL);
// console.log("PUBLIC_PATH:", process.env.PUBLIC_PATH);

module.exports = {
  mode: "development",
  // 本番環境アップ時
  // mode: "production",
  devtool: "source-map", // ソースマップを有効化
  // entry: ["./src/components/styles/tailwind.css", "./src/index.js"],
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"), // 出力先
    filename: "bundle.js", // 出力するJSファイル名
    publicPath: process.env.PUBLIC_PATH || "/", // 公開パス (環境変数から取得)
  },
  module: {
    rules: [
      {
        test: /\.js$/, // JavaScript ファイルを対象
        exclude: /node_modules/, // node_modules を除外
        use: {
          loader: "babel-loader", // Babelでトランスパイル
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // JavaScriptとReactのプリセット
          },
        },
      },
      {
        test: /\.css$/, // CSS ファイルを対象
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true, // CSSのソースマップを有効化
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")], // 必要なプラグイン
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/, // SCSS ファイルを対象
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true, // CSSのソースマップを有効化
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // SCSSのソースマップを有効化
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // テンプレートHTMLファイル
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css", // 出力するCSSファイル名
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"), // コピー元ディレクトリ
          to: path.resolve(__dirname, "dist"), // コピー先ディレクトリ
          globOptions: {
            ignore: ["**/index.html"], // index.htmlを除外
          },
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_BASE_URL": JSON.stringify(
        process.env.REACT_APP_API_BASE_URL
      ), // 環境変数を定義
      "process.env.PUBLIC_PATH": JSON.stringify(process.env.PUBLIC_PATH), // 環境変数を定義
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    hot: true,
    proxy: [
      {
        context: ["/wp-json"],
        target: "http://localhost:10009",
        // target: "http://localhost:10028",
        secure: false,
        changeOrigin: true,
      },
    ],
  },

  resolve: {
    modules: ["node_modules"], // モジュール解決ディレクトリ
  },
};
