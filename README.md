# ai-course-starter

AIコース(本コース・2週間)の受講生向けスターターキットです（JetBrains IDE + GitHub Copilot 向け）。
Step1（MVP仮説）→ Step2（ストーリー・スコープ）→ Step3（UIモック）→ Step4（実装・Cloudflare公開）までをこのリポジトリで進めます。

---

## このリポジトリでできること

```
Step 1: 何を作るかを決める（MVP仮説）
  ↓  /course-mvp-step1-hypothesis
Step 2: 画面とスコープを整理する
  ↓  /course-mvp-step2-story-scope
Step 3: UI モックを作って確認する
  ↓  /course-mvp-step3-ui-mock
Step 4: 実装して Cloudflare で公開する
  ↓  /course-mvp-step4-implement-host
```

各ステップで **Copilot Chat を Agent モードにして、prompt 名を `/` で入力**すると AI が対話しながら進めてくれます。

---

## クローン方法

```bash
git clone https://github.com/oya-ui/ai-course-starter-webstorm
cd ai-course-starter-webstorm
```

clone 後、**JetBrains IDE（WebStorm など）でこのフォルダを開き**（`File → Open...`）、
IDE 内でやることは **[docs/SETUP.md](docs/SETUP.md)** にまとまっています。まずそちらに従って進めてください。

---

## 必要なもの

| 項目 | 用途 |
|------|------|
| GitHub アカウント | clone・Copilot 利用に必要 |
| GitHub Copilot（学生無料） | Step1〜4 の対話・実装に使う |
| WebStorm（JetBrains 学生ライセンス） | 開発エディタ |
| Node.js | Step4 のビルド・ローカル確認に必要（`node -v` で確認） |
| Cloudflare アカウント（無料） | Step4 の公開に必要 |

環境づくりが済んでいない場合は、事前セットアップガイド（運営から共有されたリンク）を先に完了してください。

---

## prompt 一覧

### `course-mvp-step1-hypothesis` — MVP の仮説を固める

「何を作るか」を対話形式で整理する prompt。
誰のどんな課題を解決するか、実現難易度（緑/黄/赤）を確認しながら絞り込みます。
完了すると `mvp/STEP1.md` が作成されます。

呼び出し方: Agent モードで `/course-mvp-step1-hypothesis`

---

### `course-mvp-step2-story-scope` — 画面とスコープを整理する

Step1 の仮説をもとに、ユーザーストーリー・画面一覧・スコープ（段 A〜D）を整理します。
完了すると `mvp/STEP2.md` が作成されます。

呼び出し方: Agent モードで `/course-mvp-step2-story-scope`

---

### `course-mvp-step3-ui-mock` — UI モックを作って磨く

Step2 の画面一覧をもとに静的 HTML モック（`mvp/STEP3_UI_MOCK.html`）を作ります。
フィードバックを繰り返して「これでいい」と言えるまで一緒に磨きます。

呼び出し方: Agent モードで `/course-mvp-step3-ui-mock`

---

### `course-mvp-step4-implement-host` — 実装して公開する

Step3 のモックをもとに、レーン判定（データ共有の要否）→ 実装計画 → 足場づくり → 実装 → Cloudflare デプロイまで伴走します。
完了すると `mvp/STEP4_PLAN.md`・`app/` 配下のコード・公開URLができます。

呼び出し方: Agent モードで `/course-mvp-step4-implement-host`

---

## 成果物の保存先

```
mvp/
├── STEP1.md              ← Step1 の仮説
├── STEP2.md              ← Step2 のストーリー・スコープ
├── STEP3_UI_MOCK.html    ← Step3 の UI モック
└── STEP4_PLAN.md          ← Step4 の実装・デプロイ計画

app/                       ← Step4 で作る実装コード（Vite+React または Worker+D1）

templates/
├── worker-d1/             ← 共有データが必要な場合のコピー元テンプレ（Cloudflare Workers + D1）
└── login-firebase/        ← ログインを付ける場合のコピー元テンプレ（Firebase Googleログイン）
```

ログイン機能の付け方は **[docs/LOGIN_GUIDE.md](docs/LOGIN_GUIDE.md)** を参照してください（軽量版=名前だけの簡易ログイン／標準版=Firebase Googleログイン）。

---

## Copilot の使い方の心得

- **Agent モード必須**: Ask モードではファイルが自動保存されません
- **1メッセージ1テーマ**: あれもこれも一度に頼まず、1つ解決してから次へ
- **長くなったら新しいチャットを開く**: コンテキストが重くなると精度が下がる
- **成果物はこまめに確認**: `mvp/` フォルダのファイルが更新されているか都度確認する
- **秘密情報を貼らない**: APIキー等はチャットやコードに直接貼らず、`.dev.vars`（コミットしない）に置く

詳細は [docs/SETUP.md](docs/SETUP.md) を参照。

---

## デプロイについて

Step4 の公開先は Cloudflare（Pages / Workers + D1）です。手順は **[docs/DEPLOY_CLOUDFLARE.md](docs/DEPLOY_CLOUDFLARE.md)** を参照してください。

---

## うまくいかないとき

| 症状 | 対処 |
|------|------|
| prompt が出ない | Copilot プラグインを最新版に更新 → IDE 再起動 → チャットを新規作成 → `/course-mvp-step1-hypothesis` |
| ファイルが保存されない | Copilot Chat が **Agent モード**になっているか確認 |
| `.github/prompts/` が見えない | 正しいフォルダを開いているか確認 |
| prompt が動かない | `.github/prompts/` 内の prompt 本文をチャットに貼り付けて実行 |
| clone できない | GitHub アカウントでログイン済みか確認 |
| デプロイで詰まる | [docs/DEPLOY_CLOUDFLARE.md](docs/DEPLOY_CLOUDFLARE.md) のトラブルシュート表を確認 |

---

## ライセンス

MIT License
