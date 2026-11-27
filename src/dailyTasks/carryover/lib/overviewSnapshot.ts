import type { Summary } from '../model';
import { dayTotal, formatMetric } from './calc';

export type OverviewSnapshot = {
  date: string;
  issue: number;
  countText: string;
  hoursText: string;
};

/**
 * 概要画面用に、最新日の件数と残り時間をまとめる。
 */
export function buildOverviewSnapshot(summary: Summary): OverviewSnapshot | undefined {
  let result: OverviewSnapshot | undefined;
  const last = summary.days[summary.days.length - 1];
  /* 日別データがあるか */
  if (!last) {
    // 日別データがない場合

    // 概要を返さない
    return result;
  }
  const count = dayTotal(last, summary.items, 'count', 'all');
  const hours = dayTotal(last, summary.items, 'hours', 'all');
  result = {
    date: last.date,
    issue: last.issue,
    countText: `${formatMetric(count, 'count')} 件`,
    hoursText: `${formatMetric(hours, 'hours')} 時間`,
  };
  return result;
}