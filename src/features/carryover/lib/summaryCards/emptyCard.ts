import type { SummaryCardData } from './types';

/**
 * 期間内にデータがないときのサマリカード。
 */
export function buildEmptyCard(): SummaryCardData {
  const result: SummaryCardData = {
    label: 'データなし',
    value: '-',
    sub: '期間や項目の選択を見直してください',
  };
  return result;
}
