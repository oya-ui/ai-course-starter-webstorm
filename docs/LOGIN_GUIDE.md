# ログイン機能ガイド

MVPにログイン機能を付けたい場合の手引きです。`/course-mvp-step4-implement-host` から参照されます。

---

## ① どのログインにする?

| レーン | 内容 | 向いているケース |
|--------|------|-------------------|
| **やらない** | ログインなし | データ永続化（必達）さえ満たせばよい。ログインは推奨（R1）であって必達ではない |
| **軽量版** | 名前だけの簡易ログイン（本人確認なし・localStorageに名前を保存） | とにかく時間がない／「誰の投稿か」程度が分かればよい |
| **標準版** | Firebase Authentication の Googleログイン | 本物のログイン体験を見せたい／時間に余裕がある |

迷ったら**軽量版から始めて、時間が余ったら標準版に上げる**のがおすすめです。どちらを選んでも必達チェックリストには影響しません（ログインは推奨R1）。

---

## ② 軽量版: 名前だけの簡易ログイン

本人確認は一切しません。「名前を入力したら、その名前でアプリを使える」というUIだけを作る方式です。

```html
<div id="login-screen">
  <input id="name-input" placeholder="名前を入力" />
  <button id="login-button">はじめる</button>
</div>

<script>
  const KEY = "mvp-user-name";

  function showApp(name) {
    document.getElementById("login-screen").style.display = "none";
    // ここから先が「ログイン後」の画面
    document.getElementById("user-name").textContent = name;
  }

  const saved = localStorage.getItem(KEY);
  if (saved) showApp(saved);

  document.getElementById("login-button").addEventListener("click", () => {
    const name = document.getElementById("name-input").value.trim();
    if (!name) return;
    localStorage.setItem(KEY, name);
    showApp(name);
  });
</script>
```

- **本人確認なし**であることをREADMEに一言明記してください（同じブラウザなら誰でも別の名前で入り直せます）
- ログアウトは `localStorage.removeItem(KEY)` するだけ
- D1と組み合わせる場合は、この名前をAPIリクエストに含めて投稿者名として使う（③のセクション参照）。この場合、入力欄には**ニックネームを入れてもらう**（実名を促さない）と、共有APIに実名が残らず安全です

---

## ③ 標準版: Firebase Googleログイン手順

初心者向けに番号順で進めます。テンプレは `templates/login-firebase/index.html` にあるので、④の手順でコピーして使ってください。

1. **https://firebase.google.com** を開き、右上などから**Googleアカウントでコンソールへ**ログインする
2. 「プロジェクトを作成」→ プロジェクト名を入力 →（Google Analyticsは不要なのでオフのまま）作成する
3. 左メニューの「構築」→「Authentication」→「始める」をクリック →「Sign-in method」タブで**「Google」を選んで有効化**する（名称は変わることがある）
4. 左上の歯車アイコン →「プロジェクトの設定」→ 下にスクロールして「マイアプリ」→ `</>`（ウェブアプリを追加）をクリック → アプリ名を適当に入力して登録する →表示された `firebaseConfig` の値をコピーする
5. `templates/login-firebase/index.html` をコピーしてきたファイルの `firebaseConfig` の `REPLACE_ME` の部分に、コピーした値をそのまま貼り付ける
6. `npm run dev`（またはファイルを直接ブラウザで開く）でローカル確認する。**localhostは最初から承認済み**なので、追加設定なしでログインが動く
7. **デプロイ後に必ずやること**: Cloudflareにデプロイして公開URL（`https://プロジェクト名.pages.dev`）が発行されたら、Firebaseコンソールの「Authentication」→「設定」タブ→「承認済みドメイン」に、**自分の `*.pages.dev` ドメインを追加**する

   > **これが最重要のハマりポイントです。** 追加を忘れると、ローカルでは動いていたログインが本番（公開URL）でだけポップアップエラーになります。「本番でログインだけ動かない」と感じたら、まずここを疑ってください。

---

## ④ 自分のアプリへの組み込み方

- **モックHTML（Step3の静的HTML）に移植する場合**: `templates/login-firebase/index.html` の `<script type="module">` 部分と `#login-screen` / `#app-screen` の構造をそのままコピーし、`#app-body` の中身をStep3のモックの画面に差し替える
- **Vite+Reactの場合**: `npm install firebase` してから `firebase/app` / `firebase/auth` を通常の `import` に置き換える。`onAuthStateChanged` の結果を `useState` に入れて、ログイン済みかどうかで表示を出し分けるコンポーネントにするのが基本形（1段落の注意: ReactではuseEffect内でリスナー登録・クリーンアップでunsubscribeを呼ぶのを忘れないこと）
- **D1（レーンB）と組み合わせる場合**: ログインで得た `user.displayName` や `user.uid` を、投稿など書き込み系のAPIリクエストのbodyに含めて送る（例: `{ body, author: user.displayName }`）。サーバ側（Workers）でFirebaseのIDトークンを検証する実装は本コースの範囲外なので**やらない**（⑥参照）。あくまで「表示上の投稿者名」として使う
  - ⚠️ **注意1（アクセス制御）**: この `uid`・名前はクライアントからの自己申告値で、偽装できます。これを使った削除・編集の出し分けは「見た目の使い分け」であって、セキュリティ（アクセス制御）にはなりません。「本人にしか消せない・見られない」が必要なアプリはこのコースの範囲を超えるため、メンターに相談してください
  - ⚠️ **注意2（実名を残さない）**: Google の `displayName` は**実名のことが多い**ので、共有API（D1）に投稿者名として保存するときは、`displayName` をそのまま使わず、**アプリ内にニックネーム入力欄**を設けてその値を送ると安全です（共有APIは認証なし＝誰でも読めるため）

---

## ⑤ トラブルシュート表

| 症状 | 原因・対処 |
|------|-----------|
| `popup-blocked` エラー / ポップアップが出ない | ブラウザのポップアップブロックを許可する。またはボタンのクリックイベント内で直接 `signInWithPopup` を呼んでいるか確認（非同期処理を挟んで遅延させるとブロックされやすい） |
| `auth/unauthorized-domain` エラー | 承認済みドメインに今アクセスしているドメインが登録されていない。ローカルなら`localhost`、本番なら`*.pages.dev`をFirebaseコンソールの「Authentication→設定→承認済みドメイン」に追加する（③の手順7） |
| ログインボタンを押しても何も起きない / コンソールにエラー | `firebaseConfig` の値の貼り間違い（コピー漏れ・引用符の消し忘れ）が多い。Firebaseコンソールの「プロジェクトの設定→マイアプリ」から値を見直してコピーし直す |
| ポップアップがすぐ閉じてしまう / ログインが完了しない | ユーザーがポップアップを閉じた、または複数回連続でクリックしている。1回だけクリックして待つ。スマホのブラウザでは `signInWithRedirect` の方が安定する場合がある(本テンプレは扱わないので、詰まったら軽量版に切り替えることも検討) |

---

## ⑥ やらないこと

- サーバ側（Workers/D1）でのFirebase IDトークン検証は実装しない（2週間コースの範囲外）
- パスワード認証を自前で実装しない（ハッシュ化・再設定フローなど専門知識が必要なため）
- `firebaseConfig` 以外の場所にAPIキーを貼らない。なお **`firebaseConfig` の値自体は公開されて問題ない値**です（クライアント側で誰でも見える前提の識別子であり、`.gitignore`やCloudflareのシークレットに入れる必要はありません）
