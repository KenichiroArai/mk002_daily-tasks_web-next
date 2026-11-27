import { roundTo } from '@/shared/lib/number';

import type { Metric } from '../model';
import type { ChartSpec } from './chartData';

/** 0 を含む目盛の数の目安（間隔はおおよそ 4） */
const TARGET_INTERVALS = 4;

/**
 * 数値軸の domain と ticks
 */
export type ValueAxis = {
  domain: [number, number];
  ticks: number[];
};

/**
 * グラフの数値の最大を返す。積み上げなら行ごとの合計の最大、それ以外は系列ごとの最大。
 */
export function maxChartValue(spec: ChartSpec): number {
  let result = 0;
  for (const row of spec.rows) {
    let rowValue = 0;
    for (const series of spec.series) {
      const value = Number(row[series.key] ?? 0);
      /* 積み上げか */
      if (spec.stacked) {
        // 積み上げの場合

        // 行内の系列を足す
        rowValue += value;
      } else {
        // 積み上げではない場合

        // 系列ごとの最大を取る
        rowValue = Math.max(rowValue, value);
      }
    }
    result = Math.max(result, rowValue);
  }
  return result;
}

/**
 * 指標ごとの最小ステップ（データが 0 のときの上限）
 */
function minStep(metric: Metric): number {
  let result: number;
  switch (metric) {
    case 'minutes':
      result = 10;
      break;
    case 'hours':
      result = 0.5;
      break;
    default:
      result = 1;
      break;
  }
  return result;
}

/**
 * raw 以上の切りのいいステップを返す。
 *
 * - count: 1, 2, 5, 10, 20, 50, …
 * - minutes: 10, 20, 50, 100, …
 * - hours: 0.5, 1, 2, 5, 10, …
 */
function nextNiceStep(metric: Metric, raw: number): number {
  let result: number;
  const floor = minStep(metric);
  /* 最小ステップで足りるか */
  if (raw <= floor) {
    // 最小ステップで足りる場合

    // 最小ステップを使う
    result = floor;
    return result;
  }

  /* 分は 10 起点、件数は 1 起点の 1–2–5 × 10^n */
  if (metric === 'count' || metric === 'minutes') {
    // 件数または分の場合

    // 桁を上げながら候補を探す
    let magnitude = metric === 'minutes' ? 10 : 1;
    while (true) {
      for (const factor of [1, 2, 5] as const) {
        const step = factor * magnitude;
        /* raw 以上か */
        if (step >= raw) {
          // raw 以上の場合

          // このステップを使う
          result = step;
          return result;
        }
      }
      magnitude *= 10;
    }
  }

  // 時間の場合（0.5 のあとは 1–2–5 × 10^n）
  for (const step of [0.5, 1, 2, 5] as const) {
    /* raw 以上か */
    if (step >= raw) {
      // raw 以上の場合

      // このステップを使う
      result = step;
      return result;
    }
  }
  let magnitude = 10;
  while (true) {
    for (const factor of [1, 2, 5] as const) {
      const step = factor * magnitude;
      /* raw 以上か */
      if (step >= raw) {
        // raw 以上の場合

        // このステップを使う
        result = step;
        return result;
      }
    }
    magnitude *= 10;
  }
}

/**
 * 指標と最大値から、切りのいい数値軸（下限 0）を作る。
 */
export function buildValueAxis(metric: Metric, max: number): ValueAxis {
  let result: ValueAxis;
  const floor = minStep(metric);
  /* 値が 0 以下か */
  if (max <= 0) {
    // 値が 0 以下の場合

    // 最小ステップだけの軸にする
    result = { domain: [0, floor], ticks: [0, floor] };
    return result;
  }

  const rawStep = max / TARGET_INTERVALS;
  const step = nextNiceStep(metric, rawStep);
  const intervals = Math.max(1, Math.ceil(max / step));
  const niceMax = roundTo(step * intervals, metric === 'hours' ? 2 : 1);
  const ticks: number[] = [];
  for (let i = 0; i <= intervals; i += 1) {
    ticks.push(roundTo(step * i, metric === 'hours' ? 2 : 1));
  }
  result = { domain: [0, niceMax], ticks };
  return result;
}
