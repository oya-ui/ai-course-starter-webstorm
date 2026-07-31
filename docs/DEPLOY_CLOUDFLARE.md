# Cloudflare デプロイランブック

Step4 で作ったアプリを Cloudflare で公開するための手順書です。`/course-mvp-step4-implement-host` から参照されます。

---

## ① レーン判定フローチャート

```
このアプリのデータを、
自分以外の人や別の端末からも見たり使ったりする?
        │
   ┌────┴────┐
  Yes         No
   │           │
レーンB      レーンA
(Workers+D1) (Pages直接アップロード)
```

- 判定に迷ったら「自分一人がスマホとPCの両方で見るだけ」も基本は **レーンA**（localStorageはブラウザ単位のため、複数端末で同じデータを見たい場合はレーンB）。
- 迷ったら小さい方（レーンA）から始めて、あとから必要になったらレーンBに切り替えてよい。

---

## ② レーンA: Cloudflare Pages 直接アップロード

共有データが不要なアプリ（Vite+React または素の HTML+JS）はこちらです。**ドラッグ&ドロップだけ**で公開できます。

### A-1. ビルドする

```bash
npm run build
```

`app/dist/`（素のHTML+JSの場合はそのままの `app/` フォルダでも可）にビルド成果物ができます。

> 素の HTML+JS でビルド不要な場合はこのステップをスキップし、`index.html` を含むフォルダをそのまま次に進んでください。

### A-2. Cloudflare アカウントを作る（初回のみ）

1. https://dash.cloudflare.com/sign-up にアクセス
2. メールアドレスとパスワードで無料アカウントを作成
3. 確認メールのリンクをクリックして認証

### A-3. アップロードして公開

1. Cloudflare のダッシュボードで **Workers & Pages** を開く
2. 「Create」→ **Pages** タブ → **「Upload assets」(直接アップロード)** を選ぶ
3. プロジェクト名を入力（例: `my-first-app`）— これが URL の一部になる
4. `dist/` フォルダごとドラッグ&ドロップ
5. 「Deploy site」をクリック

> 画面の表記は変わることがあります。「Pages」「Upload assets / Direct Upload」というキーワードを目印に探してください。

### A-4. 公開URLを確認する

デプロイが終わると **`https://プロジェクト名.pages.dev`** という URL が発行されます。

1. URL を開いて表示を確認する
2. スマホでも開いてみる
3. `index.html` が見えない/真っ白の場合は、アップロードしたフォルダの**直下**に `index.html` があるか確認（サブフォルダごとアップロードすると見つからない）
4. Firebaseログイン（`templates/login-firebase/`）を使う場合は、Firebaseコンソールの承認済みドメインに今回発行された `*.pages.dev` を追加する（詳しくは `docs/LOGIN_GUIDE.md`）

### A-5. 再デプロイ（コードを直したとき）

1. もう一度 `npm run build`
2. Cloudflare ダッシュボードの該当 Pages プロジェクトを開く
3. 「Create deployment」→ 新しい `dist/` フォルダをドラッグ&ドロップ
4. 数十秒〜数分でURLが更新される（同じURLのまま）

---

## ③ レーンB: Cloudflare Workers + D1

共有データが必要なアプリは `templates/worker-d1/` を**コピーして**使います。`app/` にコピーしたあと、以下の3コマンドで公開します。

```bash
# 1. Cloudflareにログイン（ブラウザが開いて認証）
npx wrangler login

# 2. D1データベースを作成（表示された database_id を wrangler.jsonc に貼り付ける）
npx wrangler d1 create my-db

# 3. テーブルを作成（--remote を忘れずに。本番のD1に反映される）
npx wrangler d1 execute my-db --remote --file=schema.sql

# 4. デプロイ
npx wrangler deploy
```

> **Windows の場合**: コマンドプロンプトまたは PowerShell で同じコマンドが使えます。`npx` の前に何か入力を求められたら、案内に従ってください。
> **Mac の場合**: ターミナルでそのまま実行できます。

デプロイが成功すると `https://プロジェクト名.workers.dev` の URL が表示されます。

詳しい手順・スキーマの中身は `templates/worker-d1/README.md` を参照してください。

---

## ④ 縮小はしご（詰まったら1段下げる）

```
D1 で30分詰まった
   ↓ 下げる
KV（キーバリュー。単純な保存に限定）
   ↓ それでも詰まった
レーンA + localStorage
   （README に「ブラウザ内保存のみ」と制約明記 + メンターに報告）
   ↓ wrangler コマンド自体で詰まった
Pages の drag&drop に切り替える
```

**恥ずかしいことではありません。** どこまで下げても必達チェックリストは満たせます。詰まったら早めに下げる方が、公開まで到達できる確率が上がります。

---

## ⑤ トラブルシュート表

| 症状 | 原因・対処 |
|------|-----------|
| `npm run build` が失敗する | エラーログの先頭のメッセージを読む。`npm install` をやり直す。依存関係のバージョン不整合が多い |
| `wrangler login` でブラウザが開かない | ターミナルに表示された URL を手動でコピーしてブラウザに貼り付ける |
| デプロイ時に `binding DB not found` 系のエラー | `wrangler.jsonc` の `database_id` に、`d1 create` で表示された ID を貼り忘れている。貼り付けて再デプロイ |
| ローカルでは動くのに本番でデータが出ない | `d1 execute` に `--remote` を付け忘れている（付けないとローカルのみに反映される）。付け直して再実行 |
| 公開URLで 404 になる | ①アップロードしたフォルダ直下に `index.html` があるか確認 ②デプロイ直後は反映まで数分かかることがあるので待ってから再読み込み |
| うっかりAPIキーやトークンをコードに直書きした | 直書き箇所を削除し、`wrangler secret put <キー名>` でCloudflare側に登録し直す。すでに `git commit` していたら履歴からも消す必要があるのでメンターに相談 |

---

## ⑥ 附録: Git連携ビルド（上級者向け・1段落）

Cloudflare にはリポジトリを連携して push のたびに自動ビルド・デプロイする方法もありますが、本コースの標準では**採用しません**。環境変数設定・ビルド設定・デプロイトリガーの3点で詰まりやすく、初心者のサポートコストが高いためです。標準は上記②③の**直接アップロード / wrangler deploy**を使ってください。試したい人は Cloudflare Pages の公式ドキュメントの「Git integration」を参照してください（本コースの資料では手順を用意していません）。
