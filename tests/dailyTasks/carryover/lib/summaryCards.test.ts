import { sampleSummary } from '../fixtures';
import { buildSummaryCards } from '@/dailyTasks/carryover/lib/summaryCards';
import { DEFAULT_OPTIONS } from '@/dailyTasks/carryover/model';

describe('buildSummaryCards', () => {
  const { days, items } = sampleSummary();
  const options = { ...DEFAULT_OPTIONS, metric: 'count' as const, target: 'all' as const };

  it('データがない場合は「データなし」を返す', () => {
    expect(buildSummaryCards({ days: [], items, options })).toEqual([
      { label: 'データなし', value: '-', sub: '期間や項目の選択を見直してください' },
    ]);
  });

  it('最新・残り時間・平均・最大・最小のカードを返す', () => {
    const cards = buildSummaryCards({ days, items, options });
    expect(cards).toEqual([
      { label: '最新の残（件数）', value: '4 件', sub: '2026-02-01（#3）／前日比 +1' },
      { label: '最新の残り時間', value: '1.3 時間', sub: '75 分' },
      { label: '期間平均（件数）', value: '3 件', sub: '3 日間' },
      { label: '最大（件数）', value: '4 件', sub: '2026-02-01' },
      { label: '最小（件数）', value: '2 件', sub: '2026-01-30' },
    ]);
  });

  it('1 日分だけの場合は前日比を出さない', () => {
    const cards = buildSummaryCards({ days: days.slice(0, 1), items, options });
    expect(cards[0]?.sub).toBe('2026-01-30（#1）');
  });
});
