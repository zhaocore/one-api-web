import { calculateQuota, renderNumber, type LogStatistic } from '~/api/oneApi';

/** 返回最近 N 天（含今天）的 `YYYY-MM-DD` 字符串数组，按时间升序。 */
export function getLastSevenDays(days: number = 7): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${d.getFullYear()}-${month}-${day}`);
  }
  return dates;
}

/** 按天聚合后的单日指标。 */
export interface DailyAggregate {
  date: string;
  RequestCount: number;
  Quota: number;
  PromptTokens: number;
}

/** 将后端原始统计按天聚合为连续 N 天的数据点（缺失日补 0）。 */
export function getLineDataGroup(data: LogStatistic[], days: number = 7): DailyAggregate[] {
  const grouped = new Map<string, DailyAggregate>();
  for (const item of data) {
    const cur =
      grouped.get(item.Day) ?? { date: item.Day, RequestCount: 0, Quota: 0, PromptTokens: 0 };
    cur.RequestCount += item.RequestCount;
    cur.Quota += item.Quota;
    cur.PromptTokens += item.PromptTokens + item.CompletionTokens;
    grouped.set(item.Day, cur);
  }

  return getLastSevenDays(days).map((day) => grouped.get(day) ?? { date: day, RequestCount: 0, Quota: 0, PromptTokens: 0 });
}

export type LineField = 'RequestCount' | 'Quota' | 'PromptTokens';

export interface LinePoint {
  date: string;
  value: number;
}

/** 按维度字段提取折线系列并换算展示值（Quota 换算为美元）。 */
export function getLineSeries(data: LogStatistic[], field: LineField): LinePoint[] {
  return getLineDataGroup(data).map((point) => ({
    date: point.date,
    value: field === 'Quota' ? parseFloat(calculateQuota(point.Quota, 3)) : point[field],
  }));
}

export interface BarSeries {
  name: string;
  data: number[];
}

export interface BarChartData {
  series: BarSeries[];
  xaxis: string[];
}

/** 将原始统计按模型分组为堆叠柱状图数据（按最近 N 天对齐，Quota 换算为美元）。 */
export function getBarDataGroup(data: LogStatistic[], days: number = 7): BarChartData {
  const lastSeven = getLastSevenDays(days);
  const series: BarSeries[] = [];
  const byModel = new Map<string, BarSeries>();

  for (const item of data) {
    let s = byModel.get(item.ModelName);
    if (!s) {
      s = { name: item.ModelName, data: new Array(days).fill(0) };
      byModel.set(item.ModelName, s);
      series.push(s);
    }
    const index = lastSeven.indexOf(item.Day);
    if (index !== -1) {
      s.data[index] += parseFloat(calculateQuota(item.Quota, 3));
    }
  }

  return { series, xaxis: lastSeven };
}

export interface LineCardOption {
  series: { data: number[] }[];
  categories: string[];
  todayValue: string;
}

/** 生成 sparkline 折线卡片的配置（沿用 Berry 的 generateChartOptions 语义）。 */
export function generateLineCardOption(data: LogStatistic[], field: LineField): LineCardOption {
  const points = getLineSeries(data, field);
  const categories = points.map((p) => p.date);
  const values = points.map((p) => p.value);
  const today = values[values.length - 1] ?? 0;
  const todayValue = field === 'Quota' ? '$' + renderNumber(today) : renderNumber(today);
  return { series: [{ data: values }], categories, todayValue };
}
