# BTS Quiz

BTS メンバー当てクイズ（Vite + React + TypeScript）です。

## GitHub Pages 公開までにあなたがやること

1. このリポジトリを GitHub に push する（`main` ブランチ）。
2. GitHub の **Settings → Pages** を開く。
3. **Build and deployment** の **Source** を **GitHub Actions** に設定する。
4. `main` に push すると `.github/workflows/deploy-pages.yml` が実行され、自動で公開される。
5. Actions が成功したら、Pages の URL にアクセスして表示確認する。

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
