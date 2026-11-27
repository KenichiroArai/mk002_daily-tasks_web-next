import { METRIC_LABELS } from '../../constants';
import type { Day, Metric, Target } from '../../model';
import { aggregate, dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData } from './types';

/**
 * 期間平均カード。
 */
export function buildPeriodAverageCard(
  days: readonly Day[],
  items: readonly string[],
  metric: Metric,
  target: Target,
): SummaryCardData {
  let result: SummaryCardData;
  const values = days.map((day) => dayTotal(day, items, metric, target));
  const metricLabel = METRIC_LABELS[metric];
  result = {
    label: `期間平均（${metricLabel}）`,
    value: formatMetricWithUnit(aggregate(values, 'avg'), metric),
    sub: `${days.length} 日間`,
  };
  return result;
}
