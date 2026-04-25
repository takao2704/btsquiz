# BTS Quiz

BTS メンバー当てクイズ（Vite + React + TypeScript）です。

## GitHub Pages 公開までにあなたがやること

1. このリポジトリを GitHub に push する（`main` ブランチ）。
2. GitHub の **Settings → Pages** を開く。
3. **Build and deployment** の **Source** を **GitHub Actions** に設定する。
4. `main` に push すると `.github/workflows/deploy-pages.yml` が実行され、自動で公開される。
5. Actions が成功したら、Pages の URL にアクセスして表示確認する。

## エラーが出たときの確認ポイント

- Actions の `Deploy to GitHub Pages` ワークフローが成功しているか。
- 公開 URL が `https://<user>.github.io/<repo>/` 形式になっているか（例: `https://takao2704.github.io/quiz/`）。
- SPA のリロードで 404 が出る場合でも、`postbuild` で `dist/404.html` を自動生成するため改善済み。

## ローカル実行

```bash
npm ci
npm run dev
```

## ビルド・テスト

```bash
npm run build
npm test
npm run test:e2e
```

## ブラウザ中心で効率よくテスト・デバッグする運用

「再現条件が曖昧」「状態が残って原因がわからない」を防ぐため、以下の順番を固定すると効率が上がります。

### 1) まずテストケースをメモしてから触る

テンプレート（Issue やメモに貼る想定）:

- 事象: 何が期待と違うか
- 再現手順: URL / 操作順 / 何回目で発生するか
- 期待値: どうなるべきか
- 実際値: どうなったか
- 発生環境: ブラウザ種別・画面幅・ネットワーク条件

### 2) ブラウザの状態を初期化してから再現

DevTools を開いた状態で、次を毎回セットで実施:

1. **Application → Storage → Clear site data**
2. **Network → Disable cache**（DevTools を開いている間のみ有効）
3. ハードリロード（`Ctrl+Shift+R` / `Cmd+Shift+R`）

これで「キャッシュや localStorage の残骸が原因」を切り分けやすくなります。

### 3) Console / Network / Sources の3点セットで観測

- **Console**: エラー発生時刻をメモし、同時刻の Network と突き合わせる
- **Network**: 失敗リクエストの Status / Timing / Payload を確認
- **Sources**: `src/lib/useQuizEngine.ts` や `src/pages/QuizPage.tsx` など主要ロジックにブレークポイント

ポイントは「先にログを増やす」ではなく「観測点を固定」することです。

### 4) 変化が早い状態は Watch 式で追う

DevTools の Watch に以下のような式を入れると、クイズ状態の遷移を見失いにくくなります。

- 現在の問題 index
- 選択中の回答 id
- 正答数
- 判定直後フラグ（表示遷移トリガー）

※ 具体的な変数名は実装に合わせて設定してください。

### 5) 失敗ケースを「手動テスト台本」にする

再現したバグは、修正後に再確認できるよう `docs/` に 1 件 1 ファイルで残す運用が有効です。

おすすめの最小フォーマット:

- ケース名
- 事前条件
- 手順
- 期待結果
- 実施日

これを積むことで、E2E を本格導入する前でも回帰検知の質が上がります。

### 6) 修正後の確認ループ（最短版）

```bash
npm test
npm run build
npm run preview
```

- `npm test`: ロジックの退行確認
- `npm run build`: 型・ビルド破壊の検出
- `npm run preview`: 本番相当の配信状態で最終目視

### 7) 追加でやると効果が高いこと

- **デバイス幅を固定して再現**（例: 390px / 768px / 1280px）
- **Network Throttling**（Slow 3G で遷移待ちの不具合を確認）
- **Performance パネル**で重い操作区間を 5〜10 秒だけ記録

この 1〜7 をチーム共通手順にすると、デバッグ時間の短縮と再現率の向上が両立しやすくなります。


## Codexでデプロイ前に事故を減らすチェック

ブラウザ起因の不具合を減らすため、ローカルで次を実行してからデプロイするのがおすすめです。

```bash
npm test
npm run build
npm run test:e2e
```

- `npm run test:e2e` は Playwright でブラウザ実行し、**画面遷移とブラウザ実行時エラー（pageerror / console error）** を確認します。
- 初回はブラウザ本体のインストールが必要です（`npx playwright install chromium`）。
