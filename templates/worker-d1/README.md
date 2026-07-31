# worker-d1 テンプレート

共有データ（他の人・別端末とも同じデータを見る/使う）が必要なアプリ用の最小テンプレートです。
`app/` にこのフォルダの中身をコピーしてから使ってください。

## 構成

```
public/index.html   ← 最小の動作確認UI（fetchでAPIを呼ぶ）。Step3モックの移植先
src/index.ts         ← Hono製API。GET/POST /api/items の2エンドポイントのみ、認証なし
schema.sql            ← items テーブル1つだけの最小スキーマ
wrangler.jsonc         ← Cloudflareの設定（静的配信 + D1バインディング）
package.json
```

## デプロイ（3ステップ・4コマンド）

```bash
# ステップ1: Cloudflareにログイン(初回のみ・ブラウザが開いて認証)
npx wrangler login

# ステップ2: D1データベースを作成する
npx wrangler d1 create my-db
```

`d1 create` を実行すると、ターミナルに次のような出力が表示されます。

```
[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

この `database_id` の値をコピーして、`wrangler.jsonc` の `"database_id": "REPLACE_ME"` の `REPLACE_ME` の部分に貼り付けてください。

```bash
# ステップ2つづき: テーブルを作成する(--remote を忘れずに。本番のD1に反映される)
npx wrangler d1 execute my-db --remote --file=schema.sql

# ステップ3: デプロイする
npx wrangler deploy
```

デプロイが成功すると `https://<プロジェクト名>.workers.dev` の公開URLが表示されます。

> **Windows の場合**: コマンドプロンプトまたは PowerShell でそのまま実行できます。
> **Mac の場合**: ターミナルでそのまま実行できます。

## ローカルで確認する

```bash
npm install
npm run dev
```

`http://localhost:8787` で起動します（ローカルではD1もローカル用の実データが自動で使われます。本番データとは別です）。

## KVへの縮小（D1で詰まった場合）

D1のセットアップ（login / database_id / --remote）で30分以上詰まったら、KV（キーバリューストア）に縮小することを検討してください。

- `wrangler.jsonc` の `d1_databases` を `kv_namespaces` に置き換える
- `src/index.ts` の SQL クエリを `env.MY_KV.get()` / `env.MY_KV.put()` の単純な読み書きに置き換える
- テーブル構造（複数カラム・検索条件）が必要な機能はKVでは表現しづらいので、保存する値を1つのJSON文字列にまとめるなど工夫する

それでも詰まる場合は、レーンA（Pages直接アップロード + localStorage）まで下げてよいです。詳しくは `docs/DEPLOY_CLOUDFLARE.md` の縮小はしごを参照してください。

## Reactを使いたい人へ

このテンプレートは `public/index.html` に素のJSでUIを書いていますが、Reactを使いたい場合は `public/` の中身を Vite+React のビルド成果物（`dist/`）に差し替えても構いません。その場合は `wrangler.jsonc` の `assets.directory` をビルド出力先に合わせて変更し、`npm run build` をデプロイ前に実行してください。API側（`src/index.ts`）の実装はそのまま使えます。
