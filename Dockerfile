# ベースイメージ
FROM node:18-alpine

# コンテナ内の作業ディレクトリ
WORKDIR /app

# パッケージ情報をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# プロジェクトファイルをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "start"]

# コンテナが使用するポート
EXPOSE 3000
