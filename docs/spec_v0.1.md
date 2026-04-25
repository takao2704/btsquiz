# BTS Face & Name Quiz 仕様書 v0.1 (MVP)

## 1. 目的
- BTS初心者が、MVを見ながらメンバーの**顔と名前を一致**できるようになること。
- 迷わず遊べるシンプルな体験を優先し、1プレイで「少し覚えられた」を作る。

## 2. 対象ユーザー
- BTS初心者
- BTSをほぼ知らない人（グループ名だけ知っている層）
- スマホで短時間に遊びたいライトユーザー

## 3. コア体験
1. YouTube動画を再生する。
2. ソロ画角のタイミングで7人の名前ボタンが表示される。
3. ユーザーが該当メンバー名を1回タップする。
4. ソロ画角から複数メンバー画角に切り替わると、ボタンが非表示になる。
5. 区間終了時に正誤判定を確定する。
6. 全区間終了後にスコアと履歴を表示する。

## 4. MVP機能
### 必須
- YouTube埋め込み再生（まずは1動画固定）
- 問題区間（startTime/endTime/correctMember）による出題制御
- 7人分の名前ボタン表示/非表示
- 1区間1回答の受付
- 正誤判定
- スコア表示（正答数 / 総問題数）
- 履歴表示（問題ごとの回答/正解/正誤）

### 後回し
- メンバー解説表示
- 難易度選択
- ランキング
- 複数動画の選択UI

## 5. ルール設計
- 1動画に対して複数の問題区間を持つ。
- 回答可能時間は `startTime <= currentTime < endTime`。
- 各区間で回答は1回のみ有効。
- `endTime`到達で未回答なら不正解。
- `endTime`到達で回答済みなら正誤を確定。
- 全区間終了で結果画面へ遷移。

## 6. 画面仕様
### 6.1 Home画面
- アプリの説明（初心者向け）
- 「はじめる」ボタン

### 6.2 Quiz画面
- 上部: YouTubeプレイヤー
- 下部: 7人の名前ボタン
- 補助情報:
  - 問題番号（例: 3/12）
  - 現在スコア（例: 2正解）
- 区間外では名前ボタン非表示

### 6.3 Result画面
- 正答数
- 正答率
- 履歴リスト（問題番号 / 自分の回答 / 正解 / 正誤）
- 「もう一回」「Homeへ」ボタン

## 7. データ設計
動画ごとにJSONを1つ持ち、データ差し替えで別PVクイズを作成できる構成にする。

```json
{
  "videoId": "YouTube_VIDEO_ID",
  "title": "BTS - Sample",
  "members": ["RM", "Jin", "SUGA", "j-hope", "Jimin", "V", "Jungkook"],
  "questions": [
    { "id": 1, "startTime": 12.4, "endTime": 14.9, "correctMember": "V" },
    { "id": 2, "startTime": 28.1, "endTime": 30.2, "correctMember": "Jimin" }
  ]
}
```

## 8. 状態管理設計（実装ガイド）
```ts
type MemberName = "RM" | "Jin" | "SUGA" | "j-hope" | "Jimin" | "V" | "Jungkook";

type Question = {
  id: number;
  startTime: number;
  endTime: number;
  correctMember: MemberName;
};

type Attempt = {
  questionId: number;
  selectedMember: MemberName | null;
  isCorrect: boolean;
  answeredAt: number | null;
};

type QuizState = {
  phase: "idle" | "playing" | "finished";
  currentTime: number;
  activeQuestionId: number | null;
  attempts: Attempt[];
  score: number;
};
```

## 9. コンポーネント構成（React想定）
- `HomePage`
- `QuizPage`
  - `YouTubePlayer`
  - `MemberButtons`
  - `QuizHUD`
  - `JudgeToast`（任意）
- `ResultPage`
- `useQuizEngine`（ロジック）
- `quizEvaluator`（判定関数）

## 10. 非機能要件
- スマホで快適に操作できる。
- ロードが遅くない（初期は1動画+1JSONのみ読み込み）。
- 誤タップしにくいUI（ボタンサイズ・間隔を十分に確保）。
- コンテンツ更新しやすい（問題データとUIロジックを分離）。

## 11. 受け入れ基準（MVP）
1. HomeからQuizに遷移できる。
2. ソロ区間で名前ボタンが表示される。
3. 区間外で名前ボタンが非表示になる。
4. 1区間1回答のみ受け付ける。
5. 区間終了時に正誤が確定する。
6. 最終区間終了後にResultへ遷移する。
7. Resultで正答数と履歴を表示する。
8. スマホ幅で操作に支障がない。

## 12. 実装タスク（Issue分解）
### Epic 1: 基盤
- 型定義（Question / Attempt / QuizState）
- ルーティング（Home / Quiz / Result）
- JSONローダー

### Epic 2: プレイヤー連携
- YouTube IFrame API連携
- currentTime取得（100〜250ms間隔）
- onReady / onEnd処理

### Epic 3: クイズエンジン
- activeQuestion判定
- 区間終了時の確定処理
- 1区間1回答制御
- スコア集計

### Epic 4: UI
- 7人名前ボタン
- HUD（問題番号/スコア）
- 結果画面（集計/履歴）
- モバイル最適化

### Epic 5: 品質確認
- 判定ロジックのユニットテスト
- 1プレイ完走の統合確認
- スマホ幅表示確認

## 13. 注意点
- プレイヤー時刻とUI更新にはわずかなズレが出る可能性があるため、判定時に±0.2〜0.3秒の許容を検討する。
- 動画利用はYouTube埋め込みの利用規約に沿って実装する。
