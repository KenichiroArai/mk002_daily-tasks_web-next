import { METRIC_LABELS } from '../../constants';
import { aggregate, dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData, SummaryCardsInput } from './types';

/**
 * 期間平均カード。
 */
export function buildPeriodAverageCard(input: SummaryCardsInput): SummaryCardData {
  let result: SummaryCardData;
  const { days, items, options } = input;
  const { metric, target } = options;
  const values = days.map((day) => dayTotal(day, items, metric, target));
  const metricLabel = METRIC_LABELS[metric];
  result = {
    label: `期間平均（${metricLabel}）`,
    value: formatMetricWithUnit(aggregate(values, 'avg'), metric),
    sub: `${days.length} 日間`,
  };
  return result;
}
