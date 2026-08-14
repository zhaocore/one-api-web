import { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { getBarDataGroup } from '~/utils/chart';
import type { LogStatistic } from '~/api/oneApi';

const COLORS = [
  '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#55efc4',
  '#81ecec', '#74b9ff', '#a29bfe', '#00b894', '#00cec9', '#0984e3',
  '#6c5ce7', '#fab1a0', '#ff7675', '#fd79a8', '#fdcb6e', '#e17055',
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
    grid: { show: true },
    tooltip: {
      theme: 'dark' as const,
      y: { formatter: (val: number) => '$' + val },
      marker: { show: false },
    },
  };

  return (
    <section className="rounded-2xl border bg-white p-5 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold">统计</h3>
        {models.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-slate-500">
            模型
            <select
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              className="rounded-lg border bg-white px-3 py-1.5 text-sm dark:bg-slate-900">
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
        <div className="mt-4 h-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      ) : chartData.series.length > 0 ? (
        <Chart options={options} series={chartData.series} type="bar" height={480} />
      ) : (
        <div className="flex h-64 items-center justify-center text-slate-400">暂无数据</div>
      )}
    </section>
  );
}
