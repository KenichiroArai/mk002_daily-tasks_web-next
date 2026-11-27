import { availableViews, clampView, isSingleDayPeriod } from '@/dailyTasks/advance/lib/views';

describe('isSingleDayPeriod', () => {
  it('開始と終了が同じなら1日', () => {
    expect(isSingleDayPeriod('2026-02-01', '2026-02-01')).toBe(true);
  });

  it('空や異なる日は1日ではない', () => {
    expect(isSingleDayPeriod('', '')).toBe(false);
    expect(isSingleDayPeriod('2026-01-01', '2026-01-31')).toBe(false);
  });
});

describe('availableViews', () => {
  it('1日では項目ごとと持ち越し元の月ごと', () => {
    expect(availableViews('2026-02-01', '2026-02-01')).toEqual(['item', 'originMonth']);
  });

  it('複数日では推移系も含む', () => {
    expect(availableViews('2026-01-01', '2026-01-31')).toEqual([
      'item',
      'dailyItem',
      'monthlyItem',
      'originMonth',
    ]);
  });
});

describe('clampView', () => {
  it('候補内ならそのまま', () => {
    expect(clampView('originMonth', '2026-02-01', '2026-02-01')).toBe('originMonth');
  });

  it('候補外なら項目ごとに戻す', () => {
    expect(clampView('dailyItem', '2026-02-01', '2026-02-01')).toBe('item');
  });
});
