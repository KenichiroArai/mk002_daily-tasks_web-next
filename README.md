# mk002_daily-tasks_web-next

日々のタスク（GitHub Issue、1 日 1 Issue）の「持ち越し」の集計をグラフで表示する画面（Next.js + TypeScript + Recharts）です。
静的エクスポートした画面は [daily-tasks-git](https://github.com/KenichiroArai/daily-tasks-git) の GitHub Pages に公開しています。

- 公開ページ: <https://kenichiroarai.github.io/daily-tasks-git/>

## 関連リポジトリ

ローカルでは、次の 4 つを同じフォルダの下に兄弟ディレクトリとして置きます。

| リポジトリ                                                                      | 役割                                                                                                                              |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [daily-tasks-git](https://github.com/KenichiroArai/daily-tasks-git)             | 基軸。Issue、ワークフロー、データ（`docs/data/`）                                                                                 |
| [gr002_daily-tasks](https://github.com/KenichiroArai/gr002_daily-tasks)         | 収集ツール（Java）                                                                                                                |
| mk002_daily-tasks_web-next（本リポジトリ）                                      | 画面                                                                                                                              |
| [kb002_daily-tasks_doc](https://github.com/KenichiroArai/kb002_daily-tasks_doc) | 設計書（[docs/design.md](https://github.com/KenichiroArai/kb002_daily-tasks_doc/blob/main/docs/design.md)）と横断的なドキュメント |

## ローカルでの実行

Node.js（20.9 以降）が必要です。`dev` と `build` の前に、兄弟ディレクトリの `../daily-tasks-git/docs/data` を `public/data/` にコピーします。別の場所のデータを使う場合は環境変数 `CARRYOVER_DATA_DIR` にディレクトリを指定してください。

```bash
npm install

# 画面の確認（http://localhost:3000/）
npm run dev

# lint・型チェック・テスト・ビルド（静的エクスポートは out/ に出力）
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Pages の basePath は、ビルド時に環境変数 `PAGES_BASE_PATH` で渡します（daily-tasks-git のワークフローが設定します）。
