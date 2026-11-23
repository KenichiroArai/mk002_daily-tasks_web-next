import { sampleSummary } from '../fixtures';
import { createInitialState, dashboardReducer } from '@/features/carryover/hooks/dashboardReducer';

describe('createInitialState', () => {
  it('最新1日・項目ごと・残り時間（分）・全項目を選択した状態にする', () => {
    const state = createInitialState(sampleSummary());
    expect(state.options.from).toBe('2026-02-01');
    expect(state.options.to).toBe('2026-02-01');
    expect(state.options.view).toBe('item');
    expect(state.options.metric).toBe('minutes');
    expect([...state.selected]).toEqual(['英語', '数学']);
  });

  it('初期値で表示条件を上書きする', () => {
    const state = createInitialState(sampleSummary(), { view: 'originMonth', metric: 'hours' });
    expect(state.options.view).toBe('originMonth');
    expect(state.options.metric).toBe('hours');
  });

  it('最新1日では推移系の表示を項目ごとに戻す', () => {
    const state = createInitialState(sampleSummary(), { view: 'dailyItem' });
    expect(state.options.view).toBe('item');
  });
});

describe('dashboardReducer', () => {
  const initial = createInitialState(sampleSummary());

  it('表示条件を変更する', () => {
    const state = dashboardReducer(initial, { type: 'setOptions', patch: { metric: 'hours' } });
    expect(state.options.metric).toBe('hours');
  });

  it('期間を変更する', () => {
    const state = dashboardReducer(initial, { type: 'setPeriod', period: { from: '2026-02-01', to: '2026-02-01' } });
    expect(state.options.from).toBe('2026-02-01');
  });

  it('複数日から1日に変えると推移系の表示を項目ごとに戻す', () => {
    const multi = dashboardReducer(initial, {
      type: 'setPeriod',
      period: { from: '2026-01-30', to: '2026-02-01' },
    });
    const withTrend = dashboardReducer(multi, { type: 'setOptions', patch: { view: 'dailyItem' } });
    expect(withTrend.options.view).toBe('dailyItem');
    const single = dashboardReducer(withTrend, {
      type: 'setPeriod',
      period: { from: '2026-02-01', to: '2026-02-01' },
    });
    expect(single.options.view).toBe('item');
  });

  it('選択中の項目を外す', () => {
    const state = dashboardReducer(initial, { type: 'toggleItem', item: '英語' });
    expect(state.selected.has('英語')).toBe(false);
  });

  it('選択していない項目を選ぶ', () => {
    const none = dashboardReducer(initial, { type: 'selectNone' });
    const state = dashboardReducer(none, { type: 'toggleItem', item: '数学' });
    expect([...state.selected]).toEqual(['数学']);
  });

  it('すべて選択する', () => {
    const none = dashboardReducer(initial, { type: 'selectNone' });
    const state = dashboardReducer(none, { type: 'selectAll', items: ['英語', '数学'] });
    expect(state.selected.size).toBe(2);
  });
});
