import { DEFAULT_OPTIONS, type DashboardOptions } from '@/dailyTasks/advance/model';
import { sampleSummary } from '../fixtures';
import { assignColors } from '@/dailyTasks/advance/lib/calc';
import { buildChartSpec } from '@/dailyTasks/advance/lib/chartData';

const summary = sampleSummary();
const colors = assignColors(summary.items);

function build(options: Partial<DashboardOptions>, items: readonly string[] = summary.items) {
  const result = buildChartSpec(summary.days, items, colors, { ...DEFAULT_OPTIONS, ...options });
  return result;
}

describe('buildChartSpec', () => {
  it('日別推移は項目ごとの積み上げ面グラフ', () => {
    const spec = build({ view: 'dailyItem', metric: 'minutes' });
    expect(spec.kind).toBe('area');
    expect(spec.stacked).toBe(true);
    expect(spec.series.map((s) => s.label)).toEqual(['英語', '数学']);
    expect(spec.rows[1]).toEqual({ label: '2026-01-31', s0: 15, s1: 60 });
  });

  it('月ごとは項目ごとに集計して積み上げる', () => {
    const spec = build({ view: 'monthlyItem', metric: 'count', agg: 'max' });
    expect(spec.kind).toBe('bar');
    expect(spec.stacked).toBe(true);
    expect(spec.rows[0]).toEqual({ label: '2026-01', s0: 2, s1: 2 });
  });

  it('項目ごとは値の大きい順の横棒で、行ごとに色を持つ', () => {
    const spec = build({ view: 'item', metric: 'count', agg: 'sum' });
    expect(spec.horizontal).toBe(true);
    expect(spec.rows).toEqual([
      { label: '英語', color: colors['英語'], s0: 6 },
      { label: '数学', color: colors['数学'], s0: 3 },
    ]);
    expect(spec.series[0]?.label).toBe('件数（合計）');
  });

  it('持ち越し元の月ごとは項目の選択に関係なく集計する', () => {
    const spec = build({ view: 'originMonth', metric: 'count', agg: 'last', target: 'checked' }, []);
    expect(spec.rows).toEqual([
      { label: '2026-01', s0: 0 },
      { label: '2026-02', s0: 1 },
    ]);
  });

  it('選択した項目だけを対象にする', () => {
    const spec = build({ view: 'dailyItem', metric: 'count' }, ['数学']);
    expect(spec.rows.map((row) => row.s0)).toEqual([0, 2, 1]);
  });
});
