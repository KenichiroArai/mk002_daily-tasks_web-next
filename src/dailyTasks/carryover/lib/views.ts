import { DEFAULT_OPTIONS, MULTI_DAY_VIEWS, SINGLE_DAY_VIEWS, type View } from '../model';

/**
 * 開始日と終了日が同じ（かつ両方とも空でない）とき、1日だけの期間とみなす。
 */
export function isSingleDayPeriod(from: string, to: string): boolean {
  const result = from !== '' && to !== '' && from === to;
  return result;
}

/**
 * 期間に応じて選べる表示の一覧を返す。
 */
export function availableViews(from: string, to: string): readonly View[] {
  let result: readonly View[];
  /* 1日だけの期間か */
  if (isSingleDayPeriod(from, to)) {
    // 1日だけの期間の場合

    // 推移系を除いた表示にする
    result = SINGLE_DAY_VIEWS;
  } else {
    // 複数日の期間の場合

    // すべての表示を出す
    result = MULTI_DAY_VIEWS;
  }
  return result;
}

/**
 * 期間に合わない表示なら、既定の表示（項目ごと）に戻す。
 */
export function clampView(view: View, from: string, to: string): View {
  let result: View = view;
  const views = availableViews(from, to);
  /* 期間の候補に含まれるか */
  if (!views.includes(view)) {
    // 期間の候補に含まれない場合

    // 既定の表示に戻す
    result = DEFAULT_OPTIONS.view;
  }
  return result;
}
