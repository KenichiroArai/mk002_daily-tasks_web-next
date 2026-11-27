/**
 * グラフの表示の種類
 */
export const VIEWS = ['item', 'dailyItem', 'monthlyItem', 'originMonth'] as const;
export type View = (typeof VIEWS)[number];

/**
 * 1日だけの期間で選べる表示
 */
export const SINGLE_DAY_VIEWS = ['item', 'originMonth'] as const satisfies readonly View[];

/**
 * 複数日の期間で選べる表示
 */
export const MULTI_DAY_VIEWS = ['item', 'dailyItem', 'monthlyItem', 'originMonth'] as const satisfies readonly View[];

/**
 * 指標（件数・残り時間）
 */
export const METRICS = ['minutes', 'hours', 'count'] as const;
export type Metric = (typeof METRICS)[number];

/**
 * 期間内の集計方法
 */
export const AGGS = ['avg', 'sum', 'max', 'min', 'last'] as const;
export type Agg = (typeof AGGS)[number];

/**
 * 対象（チェックの有無）
 */
export const TARGETS = ['all', 'unchecked', 'checked'] as const;
export type Target = (typeof TARGETS)[number];

/**
 * 集計方法を選べる表示の種類
 */
export const AGG_VIEWS: ReadonlySet<View> = new Set<View>(['monthlyItem', 'item', 'originMonth']);

/**
 * 画面の表示条件
 */
export type DashboardOptions = {
  view: View;
  metric: Metric;
  agg: Agg;
  target: Target;
  from: string;
  to: string;
};

export const DEFAULT_OPTIONS: DashboardOptions = {
  view: 'item',
  metric: 'minutes',
  agg: 'avg',
  target: 'all',
  from: '',
  to: '',
};
