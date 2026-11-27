import { DEFAULT_OPTIONS } from '@/dailyTasks/carryover/model';
import { buildChartNote, buildChartTitle } from '@/dailyTasks/carryover/lib/chartText';

describe('buildChartTitle', () => {
  it('集計方法を選べない表示では集計方法を出さない', () => {
    expect(buildChartTitle({ ...DEFAULT_OPTIONS, view: 'dailyItem' })).toBe(
      '日別推移：残り時間（分）（すべて）',
    );
  });

  it('集計方法を選べる表示では集計方法を出す', () => {
    expect(
      buildChartTitle({
        ...DEFAULT_OPTIONS,
        view: 'monthlyItem',
        metric: 'hours',
        agg: 'max',
        target: 'checked',
      }),
    ).toBe('月ごと：残り時間（時間）・最大（チェック済みのみ）');
  });

  it('件数の見出しは件数（残）と書く', () => {
    expect(buildChartTitle({ ...DEFAULT_OPTIONS, view: 'item', metric: 'count' })).toBe(
      '項目ごと：件数（残）・平均（すべて）',
    );
  });
});

describe('buildChartNote', () => {
  it('日別推移では単位の補足だけ', () => {
    expect(buildChartNote({ ...DEFAULT_OPTIONS, view: 'dailyItem' })).toBe('単位は分です。');
  });

  it('月ごとでは単位と集計の補足', () => {
    const note = buildChartNote({ ...DEFAULT_OPTIONS, view: 'monthlyItem' });
    expect(note).toContain('単位は分です。');
    expect(note).toContain('集計は平均');
    expect(note).toContain('日ごとの残');
  });

  it('持ち越し元の月ごとでは単位・全項目・集計の補足', () => {
    expect(buildChartNote({ ...DEFAULT_OPTIONS, view: 'originMonth' })).toBe(
      '単位は分です。 持ち越し元の月ごとの表示は項目の選択に関係なく全項目を対象にします。 集計は平均です。',
    );
  });
});
