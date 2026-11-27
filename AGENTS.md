# AGENTS.md — daily-tasks（画面）

AI コーディングエージェント向けの作業ガイド。
Cursor / Codex / Claude Code など複数ツールで共通利用する。

本ドキュメントは画面（Next.js + TypeScript）のルールをまとめる。
プロジェクト全体の構成、Issue 解析の仕様、Java と TypeScript に共通するルール、画面の設計書は
[kb002_daily-tasks_doc](https://github.com/KenichiroArai/kb002_daily-tasks_doc) にまとめているので、あわせて守る。

## プロジェクト概要

- **役割**: 日々のタスク Issue の「持ち越し」と「先行」の集計をグラフと表で表示し、トップで概要を案内する静的サイトを GitHub Pages に公開する
- **ルート**: `/`（概要）、`/carryover`（持ち越し）、`/advance`（先行）
- **関連リポジトリ**（ローカルでは同じフォルダの下に兄弟ディレクトリとして置く）

| リポジトリ                                                                      | 役割                                                                                   |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [daily-tasks-git](https://github.com/KenichiroArai/daily-tasks-git)             | 基軸。Issue、ワークフロー（本リポジトリのビルドと Pages 公開）、データ（`docs/data/`） |
| [gr002_daily-tasks](https://github.com/KenichiroArai/gr002_daily-tasks)         | 収集ツール（Java。Issue を解析して daily-tasks-git の `docs/data/` に JSON を出力）    |
| mk002_daily-tasks_web-next（本リポジトリ）                                      | 画面（Next.js + TypeScript の静的エクスポート）                                        |
| [kb002_daily-tasks_doc](https://github.com/KenichiroArai/kb002_daily-tasks_doc) | 設計書と横断的なドキュメント                                                           |

- **データ**: ビルド時に daily-tasks-git の `docs/data/` を `public/data/` にコピーして使う（`scripts/copy-data.mjs`）。コピー元は環境変数 `CARRYOVER_DATA_DIR` で変えられ、未指定なら兄弟の `../daily-tasks-git/docs/data` を使う
- **SUMMARY のパス**: 持ち越しは `docs/data/summary.json`（`assetPath('/data/summary.json')`）、先行は `docs/data/advance/summary.json`（`assetPath('/data/advance/summary.json')`）。各機能の `index.ts` で `SUMMARY_PATH` として公開する
- **公開**: daily-tasks-git のワークフロー（`.github/workflows/update-carryover.yml`）が本リポジトリをチェックアウトしてビルドし、`out/` を daily-tasks-git の GitHub Pages に公開する

## 技術スタック

- Next.js（App Router、`output: 'export'` の静的エクスポート）+ TypeScript + React + Recharts、zod（JSON の検証）、CSS Modules
- Node.js 20.9 以降（CI は 22）
- テスト: Vitest + Testing Library、ESLint、Prettier

## 構成ルール

Java 側（gr002_daily-tasks）の「機能パッケージ + 層」に合わせ、`src/` も機能（feature）単位で構成する。モジュールの分け方は、kb002_daily-tasks_doc の [docs/coding-rules.md](https://github.com/KenichiroArai/kb002_daily-tasks_doc/blob/main/docs/coding-rules.md) の「役割」に従う。

```text
scripts/copy-data.mjs        # daily-tasks-git の docs/data を public/data にコピー（dev / build の前に自動実行）
out/                         # 静的エクスポートの出力（Pages に公開。Git で管理しない）
src/
  app/                       # ルーティング専用（layout.tsx / page.tsx / not-found.tsx）。ロジックを置かない
    page.tsx                 # / 概要
    carryover/page.tsx       # /carryover
    advance/page.tsx         # /advance
  dailyTasks/
    overview/                # 全体概要
      index.ts
      components/
    carryover/               # 持ち越し
      index.ts               # 機能の公開窓口。機能の外からはここだけを import する
      api/                   # データ取得（fetchSummary など）
      model/                 # 型と zod スキーマ、表示条件の型
      constants/             # ラベル、色などの定数
      lib/                   # 純粋関数（集計、グラフ用データの作成など）。関連するものはサブフォルダにまとめてよい（例: summaryCards/）
      hooks/                 # 状態管理やデータ読み込みのフック（フック専用の reducer も置く。外へは公開しない）
      components/            # 機能の画面部品
    advance/                 # 先行（carryover と同じフォルダ構成）
      index.ts
      api/
      model/
      constants/
      lib/
      hooks/
      components/
  shared/
    components/ui/           # Panel、Select、Button、Card、DateRange、Swatch などの汎用部品
    components/layout/       # Header、Footer、PageContainer
    lib/                     # assetPath（basePath 付きの URL）、数値の書式化など
    hooks/                   # 汎用フック（useAsync など）
    types/                   # 汎用の型（LoadState など）
  config/site.ts             # サイト名、リポジトリの URL など
  styles/globals.css         # CSS 変数と要素の共通スタイル
tests/                       # Vitest テスト（src/ をミラー）
  dailyTasks/overview/
  dailyTasks/carryover/
    api/                     # 例: fetchSummary.test.ts
    components/              # 例: SummaryCards/SummaryCards.test.tsx
    hooks/
    lib/
    fixtures.ts              # テスト用のデータ
  dailyTasks/advance/
  shared/
    components/
    hooks/
    lib/
```

- 依存の向きは `app` → `dailyTasks` → `shared` の一方向だけにする。`shared/`・`config/` から `dailyTasks/` を import しない
- 機能の内部（`@/dailyTasks/<機能名>/xxx`）を機能の外から import しない。`@/dailyTasks/<機能名>` の `index.ts` を経由する。同じ機能の中では相対パスを使う
- 上の 2 つは `eslint.config.mjs` の `no-restricted-imports` でチェックする（`src/` 向け。`tests/` からは `@/` で対象モジュールを import してよい）
- 機能の外のファイルは `@/`（`src/` を指す）のパスエイリアスで import する
- コンポーネントは 1 フォルダにまとめる（`Xxx.tsx`、`Xxx.module.css`、`index.ts`）。スタイルは CSS Modules にし、全体に効くものだけ `styles/globals.css` に置く
- 計算ロジックは `lib/` の純粋関数にしてコンポーネントから切り離し、Vitest でテストする。コンポーネントは Testing Library でテストする。テストファイルは `tests/` に `src/` と同じ相対パスで `*.test.ts(x)` として置く。フィクスチャは `tests/dailyTasks/<機能名>/fixtures.ts` に置く
- 純粋関数の置き場所は使われ方で決める。複数の場所から使う React 非依存の計算は `lib/` に置く。特定のフック専用で外へ公開しないもの（`dashboardReducer` など）は、そのフックと同じ `hooks/` に置き、`hooks/index.ts` では公開しない
- 各機能の `summary.json`（持ち越し・先行）は `model/` の zod スキーマで実行時に検証し、形式が想定と違う場合は画面にエラーを表示する
- データ（daily-tasks-git の `docs/data/`）を変更する処理は Java 側（gr002_daily-tasks）だけで行い、画面は読み取りだけにする
- 静的エクスポートのため、サーバー機能（API Routes、`cookies()` などの動的機能、画像最適化）は使わない
- `public/` のファイルを参照するときは `assetPath()` で basePath（Pages では `/daily-tasks-git`）を付ける
- 新しい画面は `dailyTasks/<機能名>/` を `carryover` と同じ構成で作り、`app/<ルート>/page.tsx` から呼び出す
- `node_modules/`、`.next/`、`out/`、`public/data/`（`docs/data/` のコピー）は Git で管理しない

## 設計書

- 画面の設計書は kb002_daily-tasks_doc の `docs/design/frontend.md` と `docs/design/frontend/` に Markdown で記載する。設計書全体の入口は [docs/design.md](https://github.com/KenichiroArai/kb002_daily-tasks_doc/blob/main/docs/design.md)、画面の目次は [docs/design/frontend.md](https://github.com/KenichiroArai/kb002_daily-tasks_doc/blob/main/docs/design/frontend.md) である。収集ツールの設計書は `docs/design/backend.md` に分けて置く
- 設計書は本リポジトリの `src/` の現状の実装を正として記述する
- 本リポジトリのコード（`src/`、`scripts/`、設定ファイル）を変更する場合は、フロントエンド設計書をすべて見直し、実装と食い違う箇所を更新する
- 新しい機能や画面を追加した場合は、フロントエンド設計書に章または節を追加し、`docs/design/frontend.md` の目次も更新する

## TypeScript のコーディングルール

### 対応（Map / Record）

共通ルールは kb002_daily-tasks_doc の [docs/coding-rules.md](https://github.com/KenichiroArai/kb002_daily-tasks_doc/blob/main/docs/coding-rules.md) の「対応」に従う。

- 公開する対応には型エイリアスを付ける。クラスにはしない
- 中身の `Map` や `Record` は、JSON の動的キー、関数内の一時集計、モジュール内のラベル索引なら理由をコメントして残してよい

```ts
/** 項目名と色の対応。項目名は可変なので Record のままにする。 */
export type ItemColors = Record<string, string>;
```

### 関数の戻り値

kb002_daily-tasks_doc の [docs/coding-rules.md](https://github.com/KenichiroArai/kb002_daily-tasks_doc/blob/main/docs/coding-rules.md) の「戻り値」「ローカル変数」「処理コメント」「分岐」を TypeScript にも適用する。

- 処理の見出し・大別は `/* コメント */`、個別の処理は `// コメント` で書く。既に `/* */` がある関数では他の大別にも付け、短い関数でコメントがないものはそのままでよい
- if、else if、else の直前に、何を判定するかを `/* コメント */` で書く。分岐の中では、先に判定結果（`// 〜の場合`）、続けて処理内容（`// 〜する`）を書く
- 条件がメソッド呼び出し、または比較の片側がメソッドの戻り値のときは、その戻り値を判定の直前の変数へ入れる。変数やフィールドの直接比較、`instanceof`、変数だけの複合条件は切り出さない
- メソッドの戻り値を、そのまま次のメソッドの呼び出し先にしない。いったん変数に受ける。配列の `map` / `filter` / `join` / `reduce`、`Promise.then`、zod のスキーマ連鎖、テストの `expect(...).toBe()` や Testing Library のマッチャーは定型として残してよい
- `result` 以外のローカル変数は使う直前で宣言し、使うブロックの内側に限り定義する。代入した初期値をその後読まないときは初期化しない。戻り値 `result` は先頭宣言の例外とする（詳細は coding-rules の「ローカル変数」）

- 対象: `function` 宣言と、本体が `{ }` のアロー関数（`lib/`・`hooks/`・`api/`・reducer・テスト用の関数、`scripts/` を含む）
  - 関数の戻り値は変数 `result` で定義する
  - 関数の戻り値の変数は先頭で宣言する。代入した値をその後読まないときは、その代入を書かない。初期値をガード節などで返すときだけ、初期値を置く。初期値を置かないときは先頭で `let result` を宣言し、値が決まったところで代入する（例外を投げる検証のあとに値が決まる場合も同様）。分かりやすさのため中間変数を置き、`const result` に無理にまとめない
  - return 文は `return result;` に統一する
  - ガード節（早期リターン）では `result` の初期値を返す
  - `switch` の分岐では `result` に代入して `break` し、最後に `return result;` で返す
- 対象外（そのままでよい）
  - 式だけを返す短いアロー関数（`.map((x) => ...)`、`onChange={() => ...}`、`useMemo(() => ...)` / `useCallback(() => ...)` の中身）
  - React コンポーネントが JSX を返す `return (...)`。表示しない場合の `return null;` や、読み込み中・エラー表示の早期 `return <Panel ... />` も対象外
  - `useEffect` の後片付け関数を返す `return () => { ... };`
- コンポーネントの `return` には描画に必要な最低限だけを書く。値の計算（`lib/` の関数の呼び出し、書式化など）は `return` の前で変数にしておく。一覧の描画のための `.map(...)`、条件による表示の切り替え、イベントハンドラーは JSX の中に書いてよい
- カスタムフック（JSX を返さない関数）は対象にする

```ts
// 望ましくない形式:
export function statValue(stat: Stat | undefined, metric: Metric): number {
  if (!stat) {
    return 0;
  }
  return metric === 'count' ? stat.count : stat.minutes;
}

// 望ましい形式:
export function statValue(stat: Stat | undefined, metric: Metric): number {
  let result = 0;
  if (!stat) {
    return result;
  }
  result = metric === 'count' ? stat.count : stat.minutes;
  return result;
}
```

```tsx
// 望ましくない形式:
return <CarryoverChart title={buildChartTitle(options)} spec={spec} />;

// 望ましい形式:
const chartTitle = buildChartTitle(options);
return <CarryoverChart title={chartTitle} spec={spec} />;
```

## ビルド・テスト

```bash
# 本リポジトリで実行（兄弟ディレクトリに daily-tasks-git が必要）:
npm install
npm run dev           # 開発サーバー（http://localhost:3000/）
npm run lint          # ESLint（依存の向きのチェックを含む）
npm run typecheck     # TypeScript の型チェック
npm test              # Vitest
npm run build         # 静的エクスポート（out/）
npm run format:check  # Prettier の整形の確認
```

## 変更時のチェックリスト

- [ ] `npm run lint` / `npm run typecheck` / `npm test` / `npm run build` が通り、`/`・`/carryover`・`/advance` の表示を確認
- [ ] 構成ルール（`dailyTasks/` 単位、依存の向き、コンポーネントのフォルダ構成）の順守
- [ ] TypeScript のコーディングルール（戻り値 `result`、読まれない初期代入は書かない、ローカル変数は直前・最小スコープで未使用初期化なし（`result` は先頭）、コンポーネントの `return` は描画だけ）の順守
- [ ] kb002_daily-tasks_doc の設計書をすべて見直して更新
- [ ] README の更新

## やってはいけないこと

- `shared/` から `dailyTasks/` に依存したり、機能の内部を機能の外から直接 import したりすること
- `docs/data/` の JSON を画面から変更すること（読み取りだけにする）
- サーバー機能（API Routes、動的機能、画像最適化）を使うこと
- コンポーネントの `return` の中で値の計算（`lib/` の関数の呼び出し、書式化など）を行うこと
- 本リポジトリに Java のコードや出力データ、設計書を置くこと（それぞれ gr002_daily-tasks、daily-tasks-git、kb002_daily-tasks_doc に置く）

## 順守

以上の内容を順守し、タスクを遂行してください。
