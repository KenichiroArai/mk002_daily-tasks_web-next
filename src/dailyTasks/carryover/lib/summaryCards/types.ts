import type { DashboardOptions, Day } from '../../model';

export type SummaryCardData = {
  label: string;
  value: string;
  sub: string;
};

/**
 * サマリカードを作るときの入力（期間内の日別・選択項目・表示条件）。
 */
export type SummaryCardsInput = {
  days: readonly Day[];
  items: readonly string[];
  options: DashboardOptions;
};
