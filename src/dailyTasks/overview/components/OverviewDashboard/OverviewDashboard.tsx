'use client';

import Link from 'next/link';

import {
  buildOverviewSnapshot,
  fetchSummary as fetchCarryoverSummary,
} from '@/dailyTasks/carryover';
import {
  buildOverviewSnapshot as buildAdvanceSnapshot,
  fetchSummary as fetchAdvanceSummary,
} from '@/dailyTasks/advance';
import { Card, Panel } from '@/shared/components/ui';
import { useAsync } from '@/shared/hooks';

import styles from './OverviewDashboard.module.css';

type OverviewData = {
  carryover: ReturnType<typeof buildOverviewSnapshot>;
  advance: ReturnType<typeof buildAdvanceSnapshot>;
};

const loadOverview = async (signal: AbortSignal): Promise<OverviewData> => {
  let result: OverviewData;
  const [carryoverSummary, advanceSummary] = await Promise.all([
    fetchCarryoverSummary(fetch, signal),
    fetchAdvanceSummary(fetch, signal),
  ]);
  result = {
    carryover: buildOverviewSnapshot(carryoverSummary),
    advance: buildAdvanceSnapshot(advanceSummary),
  };
  return result;
};

type TaskSectionProps = {
  title: string;
  detailHref: string;
  snapshot: OverviewData['carryover'];
};

function TaskSection({ title, detailHref, snapshot }: TaskSectionProps) {
  return (
    <Panel title={title}>
      {snapshot ? (
        <div className={styles.sectionBody}>
          <div className={styles.cards}>
            <Card label="最新日" value={snapshot.date} sub={`Issue #${snapshot.issue}`} />
            <Card label="残（件数）" value={snapshot.countText} />
            <Card label="残（時間）" value={snapshot.hoursText} />
          </div>
          <Link className={styles.detailLink} href={detailHref}>
            詳細を見る
          </Link>
        </div>
      ) : (
        <p className={styles.empty}>表示できるデータがありません。</p>
      )}
    </Panel>
  );
}

/**
 * 持ち越しと先行の概要を案内するトップ画面。
 */
export function OverviewDashboard() {
  const state = useAsync(loadOverview);

  /* 読み込み中か */
  if (state.status === 'loading') {
    // 読み込み中の場合

    // 読み込み中であることを表示する
    return <Panel note="データを読み込んでいます…">{null}</Panel>;
  }

  /* 読み込みに失敗したか */
  if (state.status === 'error') {
    // 読み込みに失敗した場合

    // 失敗したことを表示する
    return (
      <Panel title="データを読み込めませんでした" note={state.error.message}>
        {null}
      </Panel>
    );
  }

  return (
    <div className={styles.root}>
      <TaskSection title="持ち越し" detailHref="/carryover/" snapshot={state.data.carryover} />
      <TaskSection title="先行" detailHref="/advance/" snapshot={state.data.advance} />
    </div>
  );
}