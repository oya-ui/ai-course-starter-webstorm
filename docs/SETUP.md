# このリポジトリを開いてからやること

このドキュメントは、**環境づくり（WebStorm・GitHub Copilot のインストールと学生ライセンス申請）が完了している**前提で、
このリポジトリを clone したあとに **IDE 内でやること**だけをまとめた短縮版です。

> 環境づくりがまだの場合は、先に運営から共有された事前セットアップガイドを完了してください。

---

## 1. WebStorm でリポジトリを開く

1. WebStorm を起動（プロジェクトを開いている場合は File → Close Project で起動画面に戻る）
2. 起動画面の **「Get from VCS」**（または「Clone Repository」）をクリック
3. URL に `https://github.com/oya-ui/ai-course-starter-webstorm` を貼り付けて「Clone」
   - すでに手元に clone 済みの場合は `File → Open...` でフォルダを選択
4. 「Trust Project」のダイアログが出たら **Trust** を選ぶ

**確認方法**: 左のファイルツリーに `.github/prompts/` フォルダが見えていれば OK。

---

## 2. Copilot プラグインを確認する

1. `Settings → Plugins` を開く
2. 「GitHub Copilot」がインストール済み・**最新版**か確認（古いと Agent モードや prompt 機能が使えない）
3. 未サインインなら、右側の Copilot Chat アイコン（吹き出しマーク）からサインイン

---

## 3. Customizations（Custom Instructions）を有効化する

1. `Settings → Tools → GitHub Copilot → Customizations` を開く
2. Workspace の Custom Instructions が有効になっているか確認
3. `.github/copilot-instructions.md` が読み込まれていることを確認

---

## 4. Copilot Chat を Agent モードにする

1. 右側の Copilot Chat アイコン（吹き出しマーク）をクリックしてチャットを開く
2. チャット入力欄の下にあるモード選択で **Agent** を選ぶ

> ⚠️ **Ask モードのままだとファイルが保存されません。** 必ず Agent モードにしてください。

---

## 5. `/` で prompt を呼び出せるか確認する

1. チャット入力欄に `/` と入力する
2. `course-mvp-step1-hypothesis` などの候補が出れば OK
3. 出ない場合は下記「動かないときの対処」へ

---

## 6. Node.js を確認する

Step4（実装・デプロイ）で Node.js が必要になります。ターミナルで確認しておきましょう。

```bash
node -v
```

バージョンが表示されればOK。表示されない場合は [nodejs.org](https://nodejs.org/) から LTS 版をインストールしてください。

---

## 動かないときの対処

| 症状 | 対処 |
|------|------|
| `/` で prompt 候補が出ない | Copilot プラグインを最新版に更新 → WebStorm 再起動 → 新しいチャットで再試行 |
| ファイルが保存されない | Copilot Chat が **Agent モード**になっているか確認 |
| `.github/prompts/` フォルダが見えない | 正しいフォルダ（clone したリポジトリのルート）を開いているか確認 |
| Custom Instructions が反映されない | `Settings → Tools → GitHub Copilot → Customizations` で有効化を確認 → チャットを新規作成 |
| それでも動かない | `.github/prompts/course-mvp-step1-hypothesis.prompt.md` の中身をチャットに直接貼り付けて実行（フォールバック） |

---

## 次のステップ

準備ができたら、Agent モードで `/course-mvp-step1-hypothesis` と入力して Step1 を始めてください。
詳しい進め方は [README.md](../README.md) を参照。
