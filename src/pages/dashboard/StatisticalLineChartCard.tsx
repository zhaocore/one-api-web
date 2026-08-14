import Chart from 'react-apexcharts';
import type { LineCardOption } from '~/utils/chart';

/**
 * 今日指标 sparkline 折线卡片。
 * 复用 Berry StatisticalLineChartCard 的语义：大数字 + 迷你折线。
 */
export default function StatisticalLineChartCard({
  title,
  chartData,
  isLoading,
}: {
  title: string;
  chartData: LineCardOption | null;
  isLoading: boolean;
}) {
  const options = {
    chart: {
      sparkline: { enabled: true },
      background: 'transparent',
      type: 'line' as const,
    },
    dataLabels: { enabled: false },
    colors: ['#6366f1'],
    stroke: { curve: 'smooth' as const, width: 3 },
    tooltip: {
      theme: 'dark' as const,
      x: { format: 'yyyy-MM-dd' },
    },
  };

  return (
    <section className="rounded-2xl border bg-white p-5 dark:bg-slate-900">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      {isLoading ? (
        <div className="mt-4 h-16 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      ) : (
        <b className="mt-2 block text-3xl">{chartData?.todayValue ?? '0'}</b>
      )}
      {!isLoading && chartData && (
        <div className="mt-2 h-20">
          <Chart options={options} series={chartData.series} type="line" height={80} />
        </div>
      )}
      {!isLoading && !chartData && <p className="mt-4 text-sm text-slate-400">无数据</p>}
    </section>
  );
}
