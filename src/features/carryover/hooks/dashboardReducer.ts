import { presetPeriod, type Period } from '../lib';
import { clampView } from '../lib/views';
import { DEFAULT_OPTIONS, type DashboardOptions, type Summary } from '../model';

/*
 * 画面の状態を変えるルール（reducer）をまとめたファイル。
 *
 * ■ hooks/ に置いている理由
 * - useDashboardOptions.ts が `useReducer` に渡す専用の部品なので、同じフォルダに置いている。
 * - このファイルは React のフックを使わない純粋な関数だけで書いている。
 *   そのため、フックを動かさずに入力と出力だけで単体テストできる
 *   （tests/features/carryover/hooks/dashboardReducer.test.ts）。
 * - useDashboardOptions 専用の内部部品なので、hooks/index.ts では公開しない。
 *   外から使うのは useDashboardOptions だけにする。
 *
 * ■ lib/ に置かない理由
 * - lib/ は、複数の場所から使う計算（集計、期間の作成など）を置く場所である。
 * - このファイルは hooks/ の中でしか使わないので、使う場所の近くに置く。
 */

/**
 * 画面の状態（表示条件と選択中の項目）
 *
 * - options: 表示条件（表示、指標、集計、対象、期間）
 * - selected: 選択中の項目名。重複しないよう Set で持つ
 */
export type DashboardState = {
  options: DashboardOptions;
  selected: ReadonlySet<string>;
};

/**
 * 画面に対する操作（action）。`type` で操作の種類を区別する。
 */
export type DashboardAction =
  // 表示条件の一部を上書きする
  | { type: 'setOptions'; patch: Partial<DashboardOptions> }
  // 期間（from / to）を上書きする
  | { type: 'setPeriod'; period: Period }
  // 項目の選択と解除を切り替える
  | { type: 'toggleItem'; item: string }
  // 指定した項目をすべて選択する
  | { type: 'selectAll'; items: readonly string[] }
  // 選択をすべて解除する
  | { type: 'selectNone' };

/**
 * 期間に合わない表示を既定に戻した表示条件を返す。
 */
function withClampedView(options: DashboardOptions): DashboardOptions {
  const result: DashboardOptions = {
    ...options,
    view: clampView(options.view, options.from, options.to),
  };
  return result;
}

/**
 * 初期状態を作る。期間は最新1日、項目はすべて選択する。
 */
export function createInitialState(summary: Summary, initialOptions: Partial<DashboardOptions> = {}): DashboardState {
  const options = withClampedView({ ...DEFAULT_OPTIONS, ...presetPeriod(summary.days, 1), ...initialOptions });
  const result: DashboardState = {
    options,
    selected: new Set(summary.items),
  };
  return result;
}

/**
 * 今の状態と操作から、新しい状態を返す（reducer）。
 *
 * 状態は直接書き換えず、常に新しいオブジェクトを返す。
 * React は参照が変わったことで「状態が変わった」と判断して再描画するため、
 * 直接書き換えると画面が更新されない。選択項目の Set も、コピーしてから変更する。
 *
 * 例: dashboardReducer(state, { type: 'toggleItem', item: 'A' })
 */
export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  let result = state;

  /* 操作の種類ごとに新しい状態を作る */
  switch (action.type) {
    case 'setOptions':
      // 表示条件の一部を上書きする
      result = { ...state, options: withClampedView({ ...state.options, ...action.patch }) };
      break;
    case 'setPeriod':
      // 期間を上書きする
      result = { ...state, options: withClampedView({ ...state.options, ...action.period }) };
      break;
    case 'toggleItem': {
      // 元の Set は変えず、コピーしてから変更する
      const selected = new Set(state.selected);

      /* 選択済みか */
      const selectedItem = selected.has(action.item);

      if (selectedItem) {
        // 選択済みの場合

        // 選択を外す
        selected.delete(action.item);
      } else {
        // 選択済みではない場合

        // 選択する
        selected.add(action.item);
      }
      result = { ...state, selected };
      break;
    }
    case 'selectAll':
      // 指定された項目をすべて選択する
      result = { ...state, selected: new Set(action.items) };
      break;
    case 'selectNone':
      // 選択をすべて解除する
      result = { ...state, selected: new Set() };
      break;
    default:
      // 想定外の操作は状態を変えない
      break;
  }
  return result;
}
