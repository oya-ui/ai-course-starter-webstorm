-- items テーブル: このテンプレの動作確認用サンプル
-- 自分のアプリを作るときは、このテーブル定義を書き換えて
-- 自分のデータ（例: posts, tasks, entries など）に置き換える出発点として使ってください
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
