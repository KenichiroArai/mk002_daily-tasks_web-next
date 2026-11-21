import { buildEmptyCard } from './emptyCard';
import { buildLatestCountCard } from './latestCountCard';
import { buildLatestHoursCard } from './latestHoursCard';
import { buildMaxCard } from './maxCard';
import { buildMinCard } from './minCard';
import { buildPeriodAverageCard } from './periodAverageCard';
import type { SummaryCardData, SummaryCardsInput } from './types';

/**
 * 画面上部のサマリカードの内容を作る。
 */
export function buildSummaryCards(input: SummaryCardsInput): SummaryCardData[] {
  let result: SummaryCardData[] = [buildEmptyCard()];
  const last = input.days[input.days.length - 1];
  /* 最新日がないか */
  if (!last) {
    // 最新日がない場合

    // データなしのカードを返す
    return result;
  }
  result = [
    buildLatestCountCard(input),
    buildLatestHoursCard(input),
    buildPeriodAverageCard(input),
    buildMaxCard(input),
    buildMinCard(input),
  ];
  return result;
}
