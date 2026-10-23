import type { Day } from '../model';

export type Period = {
  from: string;
  to: string;
};

/**
 * 最新日を終わりとする直近 N 日間の期間を返す。N が 0 の場合は全期間とする。
 */
export function presetPeriod(days: readonly Day[], presetDays: number): Period {
  let result: Period = { from: '', to: '' };
  const first = days[0];
  const last = days[days.length - 1];
  /* 期間の端がないか */
  if (!first || !last) {
    // 期間の端がない場合

    // 空の期間を返す
    return result;
  }

  /* 全期間か */
  if (presetDays === 0) {
    // 全期間の場合

    // 最初の日から最新日までにする
    result = { from: first.date, to: last.date };
    return result;
  }
  const from = new Date(`${last.date}T00:00:00Z`);
  from.setUTCDate(from.getUTCDate() - (presetDays - 1));
  result = { from: from.toISOString().slice(0, 10), to: last.date };
  return result;
}
