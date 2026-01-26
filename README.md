# english-words
このプロジェクトは，フロントエンドとして React を使っている．
以下にローカルで動かすためのセットアップ手順を載せる．

## セットアップ手順

### 1. リポジトリをクローンする

まず，プロジェクトをローカル環境にフォークしてクローンします．

[https://github.com/soramameen/english-words.git](https://github.com/soramameen/english-words.git)

上記のサイトにあるリポジトリのForkボタンを押して，自分のリポジトリにフォークします．
その後，自分のリポジトリのURLをクローンします．
以下が実行するコマンドです．

```bash
git clone https://github.com/YourName/english-words.git
cd english-words
```

### 2. node_modulesを入手する

プロジェクトに必要なライブラリをインストールします．
初回のみ実行してください．

```bash
npm install
```

### 3. 開発サーバの起動

以下のコマンドを実行すると，ローカル環境でアプリが立ち上がります．

```bash
npm run dev
```

### 4. ブラウザ上での確認

3.のコマンドによって，localhostでサーバが起動します．
ポート番号等が自動で設定されてターミナルに表示されているので，
ブラウザで開いてください．

以下は実行例です．

```bash
>npm run dev

> english@0.0.0 dev
> vite


  VITE v7.3.1  ready in 446 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. ローカルサーバの終了

「Ctrl + c」でメッセージが表示されるので，「y」を入力することで閉じられます．


## プルリクエストの送り方

### 1. 最新の状態を取り込む

mainブランチの最新状態を手元に反映させます．

```bash
git checkout main
git pull origin main
```

### 2. 作業用のブランチを作る

直接mainに書き込めないので，新しいブランチを作成して作業します．
ブランチの名前は各自で作成してください．例えば「作業者名/変更内容の題名」
とすればよいかもしれません．

```bash
git checkout -b ブランチ名
```

### 3. 変更内容をコミットする

プロジェクトの書き換え・追加を記録します．

```bash
git add .
git commit -m "変更内容の要約"
```

### 4. 自分の作業したブランチをプッシュする

作成したブランチをリモートにプッシュします．

```bash
git push origin ブランチ名
```

### 5. GitHub上でプルリクエストを作成する

* ブラウザ上で GitHub のリポジトリページを開きます．
* 上部に "Compare & Pull request" というボタンが出ているので，それをクリックします．
* 変更内容のタイトルと説明を書いて， "Create pull request" を押せば完了です．

### 6. リモートの main ブランチの内容を pull する

最新の main ブランチの内容を持ってきて作業する場合は，以下のコマンドを入力します．

```bash
git pull https://github.com/soramameen/english-words.git main
```

その後に，2. に戻って，自分のブランチを作成するようにします．

### 7. その他

現在のブランチを確認する．main ブランチ以外で作業するようにしてください．

```bash
git branch
```

## Contribution

* 最初に実行するコマンド

```bash
git clone forkedURL
cd english-words
npm install
```

* 初めて作業を始めるときに実行するコマンド

```bash
git checkout main
git pull origin main
git checkout -b OriginalBranchName
```

* 再度作業を始めるときに実行するコマンド

```bash
git pull https://github.com/soramameen/english-words.git main
git checkout -b OriginalBranchName
```

* プルリクエストを出すときに実行するコマンド

```bash
git add .
git commit -m "Summary of changes"
git push origin OriginalBranchName
```
