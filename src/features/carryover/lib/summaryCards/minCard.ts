import { METRIC_LABELS } from '../../constants';
import { dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData, SummaryCardsInput } from './types';

/**
 * 期間内の最小カード。
 */
export function buildMinCard(input: SummaryCardsInput): SummaryCardData {
  let result: SummaryCardData;
  const { days, items, options } = input;
  const { metric, target } = options;
  const values = days.map((day) => dayTotal(day, items, metric, target));
  const minValue = Math.min(...values);
  const last = days[days.length - 1];
  const minDay = days[values.indexOf(minValue)] ?? last;
  const metricLabel = METRIC_LABELS[metric];
  result = {
    label: `最小（${metricLabel}）`,
    value: formatMetricWithUnit(minValue, metric),
    sub: minDay?.date ?? '',
  };
  return result;
}
