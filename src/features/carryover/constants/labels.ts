import type { Agg, Metric, Target, View } from '../model';

/**
 * 画面のラベル。列挙値から表示名を引くモジュール内の索引なので Record のままにする。
 */

export const VIEW_LABELS: Record<View, string> = {
  item: '項目ごと',
  dailyItem: '日別推移',
  monthlyItem: '月ごと',
  originMonth: '持ち越し元の月ごと',
};

export const METRIC_LABELS: Record<Metric, string> = {
  count: '件数',
  minutes: '残り時間（分）',
  hours: '残り時間（時間）',
};

/**
 * セレクトボックスに表示する指標のラベル
 */
export const METRIC_OPTION_LABELS: Record<Metric, string> = {
  count: '件数（残）',
  minutes: '残り時間（分）',
  hours: '残り時間（時間）',
};

export const AGG_LABELS: Record<Agg, string> = {
  avg: '平均',
  sum: '合計',
  max: '最大',
  min: '最小',
  last: '期間末の値',
};

export const TARGET_LABELS: Record<Target, string> = {
  all: 'すべて',
  unchecked: '未チェックのみ',
  checked: 'チェック済みのみ',
};

export const UNIT_LABELS: Record<Metric, string> = {
  count: '件',
  minutes: '分',
  hours: '時間',
};

/**
 * 期間のプリセット（0 は全期間、1 は最新1日）
 */
export const PERIOD_PRESETS = [
  { days: 1, label: '最新1日' },
  { days: 30, label: '直近30日' },
  { days: 0, label: '全期間' },
] as const;
