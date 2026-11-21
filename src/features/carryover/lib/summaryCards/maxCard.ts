import { METRIC_LABELS } from '../../constants';
import { dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData, SummaryCardsInput } from './types';

/**
 * 期間内の最大カード。
 */
export function buildMaxCard(input: SummaryCardsInput): SummaryCardData {
  let result: SummaryCardData;
  const { days, items, options } = input;
  const { metric, target } = options;
  const values = days.map((day) => dayTotal(day, items, metric, target));
  const maxValue = Math.max(...values);
  const last = days[days.length - 1];
  const maxDay = days[values.indexOf(maxValue)] ?? last;
  const metricLabel = METRIC_LABELS[metric];
  result = {
    label: `最大（${metricLabel}）`,
    value: formatMetricWithUnit(maxValue, metric),
    sub: maxDay?.date ?? '',
  };
  return result;
}
