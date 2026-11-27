import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DEFAULT_OPTIONS } from '@/dailyTasks/advance/model';
import { DashboardControls } from '@/dailyTasks/advance/components/DashboardControls';

function setup(
  options: Partial<(typeof DEFAULT_OPTIONS)> = {},
) {
  const result = { onOptionsChange: vi.fn(), onPeriodChange: vi.fn(), onPreset: vi.fn() };
  render(<DashboardControls options={{ ...DEFAULT_OPTIONS, ...options }} {...result} />);
  return result;
}

describe('DashboardControls', () => {
  it('表示を変えると onOptionsChange が呼ばれる', async () => {
    const { onOptionsChange } = setup({ from: '2026-01-01', to: '2026-01-31' });
    await userEvent.selectOptions(screen.getByLabelText('表示'), 'monthlyItem');
    expect(onOptionsChange).toHaveBeenCalledWith({ view: 'monthlyItem' });
  });

  it('1日の期間では項目ごとと持ち越し元の月ごとだけを出す', () => {
    setup({ from: '2026-02-01', to: '2026-02-01' });
    const select = screen.getByLabelText('表示');
    const values = within(select).getAllByRole('option').map((option) => (option as HTMLOptionElement).value);
    expect(values).toEqual(['item', 'originMonth']);
  });

  it('複数日の期間では日別推移と月ごとも出す', () => {
    setup({ from: '2026-01-01', to: '2026-01-31' });
    const select = screen.getByLabelText('表示');
    const values = within(select).getAllByRole('option').map((option) => (option as HTMLOptionElement).value);
    expect(values).toEqual(['item', 'dailyItem', 'monthlyItem', 'originMonth']);
  });

  it('日別推移では集計を選べない', () => {
    setup({ view: 'dailyItem', from: '2026-01-01', to: '2026-01-31' });
    expect(screen.getByLabelText('集計')).toBeDisabled();
  });

  it('月ごとでは集計を選べる', () => {
    setup({ view: 'monthlyItem', from: '2026-01-01', to: '2026-01-31' });
    expect(screen.getByLabelText('集計')).toBeEnabled();
  });

  it('指標の選択肢は残り時間（分）が先頭', () => {
    setup();
    const select = screen.getByLabelText('指標');
    const values = within(select).getAllByRole('option').map((option) => (option as HTMLOptionElement).value);
    expect(values).toEqual(['minutes', 'hours', 'count']);
  });

  it('プリセットを押すと日数が渡される', async () => {
    const { onPreset } = setup();
    await userEvent.click(screen.getByRole('button', { name: '直近30日' }));
    expect(onPreset).toHaveBeenCalledWith(30);
  });

  it('最新1日を押すと 1 が渡される', async () => {
    const { onPreset } = setup();
    await userEvent.click(screen.getByRole('button', { name: '最新1日' }));
    expect(onPreset).toHaveBeenCalledWith(1);
  });

  it('プリセットは最新1日・直近30日・全期間の3つ', () => {
    setup();
    expect(screen.getByRole('button', { name: '最新1日' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '直近30日' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '全期間' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '直近90日' })).not.toBeInTheDocument();
  });
});
