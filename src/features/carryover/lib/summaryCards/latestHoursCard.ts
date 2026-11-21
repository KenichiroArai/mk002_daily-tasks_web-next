import { dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData, SummaryCardsInput } from './types';

/**
 * 最新の残り時間カード。
 */
export function buildLatestHoursCard(input: SummaryCardsInput): SummaryCardData {
  let result: SummaryCardData;
  const { days, items, options } = input;
  const last = days[days.length - 1];
  /* 最新日がないか */
  if (!last) {
    // 最新日がない場合

    // 空の内容にする（オーケストレータ側で空データを処理する想定）
    result = { label: '最新の残り時間', value: '-', sub: '' };
    return result;
  }
  const lastHours = dayTotal(last, items, 'hours', options.target);
  result = {
    label: '最新の残り時間',
    value: formatMetricWithUnit(lastHours, 'hours'),
    sub: formatMetricWithUnit(lastHours * 60, 'minutes'),
  };
  return result;
}
