import { parseQueryOptions } from '@/dailyTasks/advance/lib/queryOptions';

describe('parseQueryOptions', () => {
  it('クエリがない場合は空', () => {
    expect(parseQueryOptions('')).toEqual({});
  });

  it('すべての表示条件を読み取る', () => {
    expect(parseQueryOptions('?view=monthlyItem&metric=hours&agg=max&target=checked')).toEqual({
      view: 'monthlyItem',
      metric: 'hours',
      agg: 'max',
      target: 'checked',
    });
  });

  it('想定外の値は無視する', () => {
    expect(parseQueryOptions('?view=daily&metric=count')).toEqual({ metric: 'count' });
  });
});
