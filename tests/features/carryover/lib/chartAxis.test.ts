import { buildValueAxis, maxChartValue } from '@/features/carryover/lib/chartAxis';
import type { ChartSpec } from '@/features/carryover/lib/chartData';

function spec(partial: Partial<ChartSpec> & Pick<ChartSpec, 'rows' | 'series'>): ChartSpec {
  const result: ChartSpec = {
    kind: 'bar',
    stacked: false,
    horizontal: false,
    ...partial,
  };
  return result;
}

describe('maxChartValue', () => {
  it('系列ごとの最大を返す', () => {
    const chart = spec({
      rows: [
        { label: 'a', s0: 3, s1: 1 },
        { label: 'b', s0: 2, s1: 4 },
      ],
      series: [
        { key: 's0', label: 'A', color: '#000' },
        { key: 's1', label: 'B', color: '#111' },
      ],
    });
    expect(maxChartValue(chart)).toBe(4);
  });

  it('積み上げなら行ごとの合計の最大を返す', () => {
    const chart = spec({
      stacked: true,
      rows: [
        { label: 'a', s0: 3, s1: 1 },
        { label: 'b', s0: 2, s1: 4 },
      ],
      series: [
        { key: 's0', label: 'A', color: '#000' },
        { key: 's1', label: 'B', color: '#111' },
      ],
    });
    expect(maxChartValue(chart)).toBe(6);
  });
});

describe('buildValueAxis', () => {
  it('件数が小さいときは 1 刻みにする', () => {
    expect(buildValueAxis('count', 3)).toEqual({
      domain: [0, 3],
      ticks: [0, 1, 2, 3],
    });
  });

  it('件数は 5 刻みも選ぶ', () => {
    expect(buildValueAxis('count', 18)).toEqual({
      domain: [0, 20],
      ticks: [0, 5, 10, 15, 20],
    });
  });

  it('分は 10 刻みにする', () => {
    expect(buildValueAxis('minutes', 35)).toEqual({
      domain: [0, 40],
      ticks: [0, 10, 20, 30, 40],
    });
  });

  it('分は 20 刻みも選ぶ', () => {
    expect(buildValueAxis('minutes', 70)).toEqual({
      domain: [0, 80],
      ticks: [0, 20, 40, 60, 80],
    });
  });

  it('時間は 0.5 刻みにする', () => {
    expect(buildValueAxis('hours', 1.2)).toEqual({
      domain: [0, 1.5],
      ticks: [0, 0.5, 1, 1.5],
    });
  });

  it('時間は 1 刻みも選ぶ', () => {
    expect(buildValueAxis('hours', 3.2)).toEqual({
      domain: [0, 4],
      ticks: [0, 1, 2, 3, 4],
    });
  });

  it('最大が 0 のときは指標の最小ステップにする', () => {
    expect(buildValueAxis('count', 0)).toEqual({ domain: [0, 1], ticks: [0, 1] });
    expect(buildValueAxis('minutes', 0)).toEqual({ domain: [0, 10], ticks: [0, 10] });
    expect(buildValueAxis('hours', 0)).toEqual({ domain: [0, 0.5], ticks: [0, 0.5] });
  });
});
