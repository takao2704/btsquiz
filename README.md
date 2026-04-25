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
```
