'use client';

import { useMemo, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';

import { Panel } from '@/shared/components/ui';

import { METRIC_LABELS } from '../../constants';
import { buildValueAxis, formatMetric, maxChartValue, type ChartRow, type ChartSpec } from '../../lib';
import type { Metric } from '../../model';
import styles from './AdvanceChart.module.css';
import { ChartTooltip, type ChartTooltipEntry } from './ChartTooltip';

type AdvanceChartProps = {
  title: string;
  note: string;
  spec: ChartSpec;
  metric: Metric;
};

function toEntries(spec: ChartSpec, props: TooltipContentProps): ChartTooltipEntry[] {
  const result = (props.payload ?? []).map((item) => {
    let result: ChartTooltipEntry;
    const row = item.payload as ChartRow | undefined;
    const series = spec.series.find((s) => s.key === item.dataKey);
    result = {
      name: spec.horizontal ? String(row?.label ?? '') : (series?.label ?? String(item.name ?? '')),
      value: Number(item.value ?? 0),
      color: row?.color ?? series?.color ?? '#000',
    };
    return result;
  });
  return result;
}

/**
 * 先行のグラフ（Recharts）
 */
export function AdvanceChart({ title, note, spec, metric }: AdvanceChartProps) {
  const axisTitle = METRIC_LABELS[metric];
  const showLegend = spec.series.length > 1;
  const valueAxis = useMemo(() => buildValueAxis(metric, maxChartValue(spec)), [metric, spec]);
  const formatTick = (value: number) => formatMetric(value, metric);
  const allowDecimals = metric === 'hours';

  const tooltip = (
    <Tooltip
      isAnimationActive={false}
      content={(props: TooltipContentProps) => (
        <ChartTooltip
          active={props.active}
          label={spec.horizontal ? undefined : (props.label as string | number | undefined)}
          entries={toEntries(spec, props)}
          metric={metric}
          stacked={spec.stacked}
        />
      )}
    />
  );
  const legend = showLegend ? <Legend verticalAlign="bottom" itemSorter={null} /> : null;
  const valueAxisLabel = { value: axisTitle, angle: -90, position: 'insideLeft' as const, offset: 10 };

  let chart: ReactNode;
  /* 面グラフか */
  if (spec.kind === 'area') {
    // 面グラフの場合

    // 面グラフを描く
    chart = (
      <AreaChart data={spec.rows} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" minTickGap={24} />
        <YAxis
          domain={valueAxis.domain}
          ticks={valueAxis.ticks}
          tickFormatter={formatTick}
          label={valueAxisLabel}
          allowDecimals={allowDecimals}
        />
        {tooltip}
        {legend}
        {spec.series.map((series) => (
          <Area
            key={series.key}
            type="monotone"
            dataKey={series.key}
            name={series.label}
            stackId={spec.stacked ? 'stack' : undefined}
            stroke={series.color}
            strokeWidth={spec.stacked ? 1 : 2}
            fill={series.color}
            fillOpacity={spec.stacked ? 0.6 : 0.15}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    );
  } else if (spec.horizontal) {
    // 横棒グラフの場合

    // 横棒グラフを描く
    chart = (
      <BarChart data={spec.rows} layout="vertical" margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={valueAxis.domain}
          ticks={valueAxis.ticks}
          tickFormatter={formatTick}
          allowDecimals={allowDecimals}
          label={{ value: axisTitle, position: 'insideBottom', offset: -12 }}
        />
        <YAxis type="category" dataKey="label" width={280} interval={0} />
        {tooltip}
        {spec.series.map((series) => (
          <Bar key={series.key} dataKey={series.key} name={series.label} isAnimationActive={false}>
            {spec.rows.map((row) => (
              <Cell key={row.label} fill={row.color ?? series.color} />
            ))}
          </Bar>
        ))}
      </BarChart>
    );
  } else {
    // 縦棒グラフの場合

    // 縦棒グラフを描く
    chart = (
      <BarChart data={spec.rows} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" />
        <YAxis
          domain={valueAxis.domain}
          ticks={valueAxis.ticks}
          tickFormatter={formatTick}
          label={valueAxisLabel}
          allowDecimals={allowDecimals}
        />
        {tooltip}
        {legend}
        {spec.series.map((series) => (
          <Bar
            key={series.key}
            dataKey={series.key}
            name={series.label}
            stackId={spec.stacked ? 'stack' : undefined}
            fill={series.color}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    );
  }

  const panelNote = note || undefined;

  return (
    <Panel title={title} note={panelNote}>
      <div className={styles.wrap}>
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
