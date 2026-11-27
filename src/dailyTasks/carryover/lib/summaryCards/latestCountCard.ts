import type { Day, Target } from '../../model';
import { dayTotal, formatMetric } from '../calc';
import type { SummaryCardData } from './types';

/**
 * 最新の残（件数）カード。
 */
export function buildLatestCountCard(
  days: readonly Day[],
  items: readonly string[],
  target: Target,
): SummaryCardData {
  let result: SummaryCardData;
  const last = days[days.length - 1]!;
  const prev = days.length > 1 ? days[days.length - 2] : undefined;
  const lastCount = dayTotal(last, items, 'count', target);
  const diff = prev ? lastCount - dayTotal(prev, items, 'count', target) : 0;
  const sign = diff > 0 ? '+' : '';
  const prevText = prev ? `／前日比 ${sign}${formatMetric(diff, 'count')}` : '';
  result = {
    label: '最新の残（件数）',
    value: `${formatMetric(lastCount, 'count')} 件`,
    sub: `${last.date}（#${last.issue}）${prevText}`,
  };
  return result;
}
