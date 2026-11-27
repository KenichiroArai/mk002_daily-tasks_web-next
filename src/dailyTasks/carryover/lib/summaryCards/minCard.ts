import { METRIC_LABELS } from '../../constants';
import type { Day, Metric, Target } from '../../model';
import { dayTotal, formatMetricWithUnit } from '../calc';
import type { SummaryCardData } from './types';

/**
 * 期間内の最小カード。
 */
export function buildMinCard(
  days: readonly Day[],
  items: readonly string[],
  metric: Metric,
  target: Target,
): SummaryCardData {
  let result: SummaryCardData;
  const values = days.map((day) => dayTotal(day, items, metric, target));
  const minValue = Math.min(...values);
  const last = days[days.length - 1]!;
  const minDay = days[values.indexOf(minValue)] ?? last;
  const metricLabel = METRIC_LABELS[metric];
  result = {
    label: `最小（${metricLabel}）`,
    value: formatMetricWithUnit(minValue, metric),
    sub: minDay.date,
  };
  return result;
}
