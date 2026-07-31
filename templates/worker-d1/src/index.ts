import { Hono } from "hono";

// Cloudflare Workers のバインディング（環境変数・接続先）の型定義
// wrangler.jsonc の d1_databases.binding と同じ名前（"DB"）にすること
type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// このテンプレは認証なしの最小構成です。
// 「自分だけが使う」「クラス内だけで共有する」用途を想定しています。
// 個人情報や機微なデータを扱うアプリでは使わないでください。

// GET /api/items: 保存されているものを新しい順で返す（最大100件）
app.get("/api/items", async (c) => {
  // LIMIT で件数を絞る。無制限だと件数が積み上がったとき画面ごと重くなる
  const { results } = await c.env.DB.prepare(
    "SELECT id, body, created_at FROM items ORDER BY id DESC LIMIT 100"
  ).all();
  return c.json(results);
});

// POST /api/items: { body: string } を受け取って1件保存する
app.post("/api/items", async (c) => {
  const payload = await c.req.json<{ body?: string }>();
  const body = payload.body?.trim();

  if (!body) {
    return c.json({ error: "body is required" }, 400);
  }

  // 文字数上限。上限が無いと巨大なデータを投げ込まれて保存容量を食い潰される。
  // 上限値(500)は題材に合わせて変えてよい（例: 長文日記なら2000）。ただし上限を無くさない
  if (body.length > 500) {
    return c.json({ error: "body is too long (max 500)" }, 400);
  }

  // SQLは必ず prepare + bind（プレースホルダ）で書く。
  // 文字列連結で SQL を組み立てると、入力に SQL を混ぜられて
  // データベースを不正操作される（SQLインジェクション）
  await c.env.DB.prepare(
    "INSERT INTO items (body, created_at) VALUES (?, datetime('now'))"
  )
    .bind(body)
    .run();

  return c.json({ ok: true }, 201);
});

// 上記以外のパス（/ や /index.html など）は wrangler.jsonc の
// assets 設定により public/ フォルダの静的ファイルが自動で配信される
export default app;
