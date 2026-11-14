/**
 * 指定した小数の桁数で四捨五入する。
 */
export function roundTo(value: number, digits: number): number {
  let result: number;
  const factor = 10 ** digits;
  result = Math.round(value * factor) / factor;
  return result;
}

/**
 * 日本語のロケールで数値を書式化する。整数以外は指定した桁数に丸める。
 */
export function formatNumber(value: number, digits: number): string {
  let result: string;
  const rounded = Number.isInteger(value) ? value : Number(value.toFixed(digits));
  result = rounded.toLocaleString('ja-JP');
  return result;
}
