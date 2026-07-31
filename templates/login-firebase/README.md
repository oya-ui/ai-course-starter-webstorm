# login-firebase テンプレート

Firebase Authentication（Googleログイン）の最小テンプレートです。`index.html` を自分の `app/` にコピーし、`firebaseConfig` の `REPLACE_ME` を自分のプロジェクトの値に置き換えて使ってください。

- 中身は `index.html` 1ファイルで完結（Firebase SDKはCDNから読み込み）
- Googleでログイン → ユーザー名・アイコン表示 → ログアウトボタン → `#app-body` の中に自分のMVPを実装する

詳しい設定手順・トラブルシュートは **[../../docs/LOGIN_GUIDE.md](../../docs/LOGIN_GUIDE.md)** を参照してください。
