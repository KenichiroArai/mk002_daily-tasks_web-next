import { AGGS, METRICS, TARGETS, VIEWS, type DashboardOptions } from '../model';

type QueryOptions = Partial<Pick<DashboardOptions, 'view' | 'metric' | 'agg' | 'target'>>;

function pick<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T | undefined {
  const value = params.get(key);
  const result = allowed.find((candidate) => candidate === value);
  return result;
}

/**
 * URL のクエリ文字列から表示条件の初期値を読み取る。想定外の値は無視する。
 *
 * 例: `?view=monthly&metric=hours`
 */
export function parseQueryOptions(search: string): QueryOptions {
  const params = new URLSearchParams(search);
  const result: QueryOptions = {};
  const view = pick(params, 'view', VIEWS);
  const metric = pick(params, 'metric', METRICS);
  const agg = pick(params, 'agg', AGGS);
  const target = pick(params, 'target', TARGETS);
  /* 表示があるか */
  if (view) {
    // 表示がある場合

    // 表示を初期値にする
    result.view = view;
  }

  /* 指標があるか */
  if (metric) {
    // 指標がある場合

    // 指標を初期値にする
    result.metric = metric;
  }

  /* 集計があるか */
  if (agg) {
    // 集計がある場合

    // 集計を初期値にする
    result.agg = agg;
  }

  /* 対象があるか */
  if (target) {
    // 対象がある場合

    // 対象を初期値にする
    result.target = target;
  }
  return result;
}
