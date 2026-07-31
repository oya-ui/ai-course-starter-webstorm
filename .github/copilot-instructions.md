# AIコース(本コース) — プロジェクト全体の指示

このリポジトリは AIコース(2週間MVPコース)の Step1〜4 用スターターキットです。

## 基本ルール

- 日本語で対話する
- 成果物は `mvp/` フォルダ(Step1〜3)または `app/` フォルダ(Step4)に保存する
- 1メッセージ1テーマ。あれもこれも一度に頼まない
- 各ステップは新しいチャットで始める（前のステップの履歴を引きずらない）
- ファイルの作成・更新は Agent モードで行い、ユーザーに「保存して」と言わせない

## ステップの進め方

| Step | 呼び出し | 成果物 |
|------|---------|--------|
| Step1 | `/course-mvp-step1-hypothesis` | `mvp/STEP1.md` |
| Step2 | `/course-mvp-step2-story-scope` | `mvp/STEP2.md` |
| Step3 | `/course-mvp-step3-ui-mock` | `mvp/STEP3_UI_MOCK.html` |
| Step4 | `/course-mvp-step4-implement-host` | `mvp/STEP4_PLAN.md` + `app/` 配下のコード + 公開URL |

各ステップの詳細手順は `.github/prompts/` の対応する prompt ファイルに従う。

## やらないこと

- テンプレだけ渡してインタビューを省かない
- 推測で成果物を埋めない。必ずユーザーに質問する
- Step3 了承前に Step4 を始めない
- Next.js / Vercel / Supabase は提案しない（本コースのスタックは Vite+React + Cloudflare）
- 認証は Firebase Authentication（Googleログイン）のみを提案する（それ以外の認証サービス・自作パスワード認証は提案しない）

## セキュリティ規範（コードを書く・変更するとき）

> **考え方**: セキュリティは*やりたいことを止めるため*ではなく、*安全に実現するため*のもの。危険な設計を見つけたら、頭ごなしに禁止せず、まず安全な代替案を出す。どうしても難しい題材は「ここはメンターに相談しよう」と案内して先へ進める。アイデア出し（Step1〜3）は自由。安全策を効かせるのは実装（Step4）で十分。

- API キー・トークンなどの秘密情報を**チャット本文やコードに直接貼らない**。秘密情報は Cloudflare の `wrangler secret` または `.dev.vars`（ローカル用）に置く。`.dev.vars` と `.env` は `.gitignore` 済み。**コミットしない**
- APIキーが必要な外部APIは、レーンA（静的Pages）では使わない（フロントに直書きするしかなくなるため）。使うならレーンBにして Worker 側から呼び、キーは `wrangler secret` に置く
- ユーザーが入力した文字を `innerHTML` に入れない。表示は `textContent` を使う（React の場合は標準の埋め込みのまま。`dangerouslySetInnerHTML` を使わない）
- SQL は必ず `.prepare(...).bind(...)`（プレースホルダ）で書く。文字列連結で SQL 文を組み立てない
- 入力を受け取る API には文字数上限チェックを付ける（目安 500 字。題材に合わせて変えてよいが、上限を無くさない。テンプレ `templates/worker-d1/src/index.ts` 参照）
- **共有API（レーンB / D1）に生の個人情報（実名・連絡先・住所・健康状態など）を保存する設計は、まず安全な形に置き換える**——ニックネームやダミーデータにする、または本人の端末だけに残るレーンA（localStorage）にする。置き換えが難しい題材は止めずに「この構成では公開APIに個人情報が残る点だけメンターに相談しよう」と案内する。**自分専用のレーンA（localStorage）は対象外**（データが端末から出ないため、実名でも問題ない）
- ログインで得た `user.uid` / `displayName` は「表示用」。クライアントからの自己申告値で偽装できるため、削除・編集の権限チェックには使えない前提で実装する
- Step4 の最後に必ず「公開時セキュリティチェック」（Step4 prompt のフェーズ5）を実施する
- もっと詳しく学びたい・迷ったとき: https://ai-dev-security.pages.dev

## 公開について

- Step3 のモックはあくまで見た目確認用。本番公開は Step4 で行う
- Step4 の公開先は Cloudflare（Pages / Workers + D1）。手順は `docs/DEPLOY_CLOUDFLARE.md` を参照
- ユーザーが「まず計画を出して」と言ったら、実装せず計画だけを提示して確認を取る
