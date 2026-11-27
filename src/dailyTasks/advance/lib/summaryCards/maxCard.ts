import { METRIC_LABELS } from '../../constants';
import type { Day, Metric, Target } from '../../model';
import { dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData } from './types';

/**
 * 期間内の最大カード。
 */
export function buildMaxCard(
  days: readonly Day[],
  items: readonly string[],
  metric: Metric,
  target: Target,
): SummaryCardData {
  let result: SummaryCardData;
  const values = days.map((day) => dayTotal(day, items, metric, target));
  const maxValue = Math.max(...values);
  const last = days[days.length - 1]!;
  const maxDay = days[values.indexOf(maxValue)] ?? last;
  const metricLabel = METRIC_LABELS[metric];
  result = {
    label: `最大（${metricLabel}）`,
    value: formatMetricWithUnit(maxValue, metric),
    sub: maxDay.date,
  };
  return result;
}
