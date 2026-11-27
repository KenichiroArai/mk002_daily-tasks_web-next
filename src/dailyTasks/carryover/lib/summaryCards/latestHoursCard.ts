import type { Day, Target } from '../../model';
import { dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData } from './types';

/**
 * 最新の残り時間カード。
 */
export function buildLatestHoursCard(
  days: readonly Day[],
  items: readonly string[],
  target: Target,
): SummaryCardData {
  let result: SummaryCardData;
  const last = days[days.length - 1]!;
  const lastHours = dayTotal(last, items, 'hours', target);
  result = {
    label: '最新の残り時間',
    value: formatMetricWithUnit(lastHours, 'hours'),
    sub: formatMetricWithUnit(lastHours * 60, 'minutes'),
  };
  return result;
}
