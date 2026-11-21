import { dayTotal, formatMetric } from '../calc';
import type { SummaryCardData, SummaryCardsInput } from './types';

/**
 * 最新の残（件数）カード。
 */
export function buildLatestCountCard(input: SummaryCardsInput): SummaryCardData {
  let result: SummaryCardData;
  const { days, items, options } = input;
  const last = days[days.length - 1];
  /* 最新日がないか */
  if (!last) {
    // 最新日がない場合

    // 空の内容にする（オーケストレータ側で空データを処理する想定）
    result = { label: '最新の残（件数）', value: '-', sub: '' };
    return result;
  }
  const prev = days.length > 1 ? days[days.length - 2] : undefined;
  const lastCount = dayTotal(last, items, 'count', options.target);
  const diff = prev ? lastCount - dayTotal(prev, items, 'count', options.target) : 0;
  const sign = diff > 0 ? '+' : '';
  const prevText = prev ? `／前日比 ${sign}${formatMetric(diff, 'count')}` : '';
  result = {
    label: '最新の残（件数）',
    value: `${formatMetric(lastCount, 'count')} 件`,
    sub: `${last.date}（#${last.issue}）${prevText}`,
  };
  return result;
}
