import {
  AGG_LABELS,
  METRIC_OPTION_LABELS,
  TARGET_LABELS,
  UNIT_LABELS,
  VIEW_LABELS,
} from '../constants';
import { AGG_VIEWS, type DashboardOptions } from '../model';

/**
 * グラフの見出し
 */
export function buildChartTitle(options: DashboardOptions): string {
  let result: string;
  const aggText = AGG_VIEWS.has(options.view) ? `・${AGG_LABELS[options.agg]}` : '';
  result = `${VIEW_LABELS[options.view]}：${METRIC_OPTION_LABELS[options.metric]}${aggText}（${TARGET_LABELS[options.target]}）`;
  return result;
}

/**
 * グラフの補足
 */
export function buildChartNote(options: DashboardOptions): string {
  let result: string;
  const notes: string[] = [];
  notes.push(`単位は${UNIT_LABELS[options.metric]}です。`);

  /* 先行元の月ごとか */
  if (options.view === 'originMonth') {
    // 先行元の月ごとの場合

    // 全項目が対象であることを補足する
    notes.push('先行元の月ごとの表示は項目の選択に関係なく全項目を対象にします。');
  }

  /* 集計表示か */
  const aggregatedView = AGG_VIEWS.has(options.view);

  if (aggregatedView && options.view !== 'originMonth') {
    // 集計表示の場合

    // 選択中の集計と、日ごとの残から計算することを補足する
    notes.push(
      `集計は${AGG_LABELS[options.agg]}（日ごとの残をもとに計算します。例: 平均は期間内の 1 日あたりの残）。`,
    );
  } else if (aggregatedView) {
    // 先行元の月ごとの集計表示の場合

    // 選択中の集計名を補足する
    notes.push(`集計は${AGG_LABELS[options.agg]}です。`);
  }
  result = notes.join(' ');
  return result;
}
