import { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { getBarDataGroup } from '~/utils/chart';
import type { LogStatistic } from '~/api/oneApi';

const COLORS = [
  '#0f766e', '#14b8a6', '#5eead4', '#334155', '#64748b', '#94a3b8',
  '#115e59', '#0d9488', '#99f6e4', '#1e293b', '#475569', '#cbd5e1',
  '#134e4a', '#2dd4bf', '#ccfbf1', '#0f172a', '#64748b', '#e2e8f0',
];

/**
 * 按模型堆叠的柱状统计图（近 7 天消耗，美元计价）。
 * 复用 Berry StatisticalBarChart 语义，并新增模型维度筛选。
 * 后端 /api/user/dashboard 仅按 day + model_name 聚合，无渠道维度，故仅提供模型筛选。
 */
export default function StatisticalBarChart({
  statistics,
  isLoading,
}: {
  statistics: LogStatistic[];
  isLoading: boolean;
}) {
  const [selectedModel, setSelectedModel] = useState('all');

  const models = useMemo(
    () => Array.from(new Set(statistics.map((item) => item.ModelName))).sort(),
    [statistics],
  );

  const filtered = useMemo(
    () => (selectedModel === 'all' ? statistics : statistics.filter((item) => item.ModelName === selectedModel)),
    [statistics, selectedModel],
  );

  const chartData = useMemo(() => getBarDataGroup(filtered), [filtered]);

  const options = {
    colors: COLORS,
    chart: {
      id: 'bar-chart',
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
      type: 'bar' as const,
    },
    plotOptions: { bar: { horizontal: false, columnWidth: '50%' } },
    xaxis: { type: 'category' as const, categories: chartData.xaxis },
    legend: {
      show: true,
      fontSize: '14px',
      position: 'bottom' as const,
      offsetX: 20,
      markers: { size: 16 },
      itemMargin: { horizontal: 15, vertical: 8 },
    },
    fill: { type: 'solid' as const },
    dataLabels: { enabled: false },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4 },
    tooltip: {
      theme: 'dark' as const,
      y: { formatter: (val: number) => '$' + val },
      marker: { show: false },
    },
  };

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">用量趋势</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">近 7 天模型消耗</h3>
        </div>
        {models.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="sr-only">模型</span>
            <select
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <option value="all">全部</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {isLoading ? (
        <div className="m-6 h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      ) : chartData.series.length > 0 ? (
        <div className="px-3 pb-2 pt-4 sm:px-5">
          <Chart options={options} series={chartData.series} type="bar" height={480} />
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-slate-400">暂无可展示数据</div>
      )}
    </section>
  );
}
