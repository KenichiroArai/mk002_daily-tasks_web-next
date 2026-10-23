import { assetPath } from '@/shared/lib';

import { summarySchema, type Summary } from '../model';

export const SUMMARY_PATH = '/data/summary.json';

/**
 * summary.json を取得し、形式を検証して返す。
 *
 * @param fetcher 取得に使う関数（テストで差し替える）
 * @param signal 取得を中断するためのシグナル
 * @throws 取得に失敗した場合、中断された場合、または形式が想定と異なる場合
 */
export async function fetchSummary(fetcher: typeof fetch = fetch, signal?: AbortSignal): Promise<Summary> {
  const response = await fetcher(assetPath(SUMMARY_PATH), { cache: 'no-cache', signal });
  /* 取得が成功か */
  if (!response.ok) {
    // 取得が成功ではない場合

    // 取得失敗として例外にする
    throw new Error(`summary.json の取得に失敗しました（${response.status}）`);
  }
  const json: unknown = await response.json();
  const parsed = summarySchema.safeParse(json);
  /* 形式が正しいか */
  if (!parsed.success) {
    // 形式が正しくない場合

    // 形式の不正として例外にする
    throw new Error(`summary.json の形式が想定と異なります: ${parsed.error.issues[0]?.message ?? '不明なエラー'}`);
  }
  const result = parsed.data;
  return result;
}
