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
  emphasis,
}: {
  title: string;
  chartData: LineCardOption | null;
  isLoading: boolean;
  emphasis: 'primary' | 'secondary';
}) {
  const options = {
    chart: {
      sparkline: { enabled: true },
      background: 'transparent',
      type: 'line' as const,
    },
    dataLabels: { enabled: false },
    colors: ['#0f766e'],
    stroke: { curve: 'smooth' as const, width: 3 },
    tooltip: {
      theme: 'dark' as const,
      x: { format: 'yyyy-MM-dd' },
    },
  };

  return (
    <section
      className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(15,23,42,0.42)] active:translate-y-0 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none ${
        emphasis === 'primary' ? 'md:p-6' : ''
      }`}>
      <div className="absolute inset-x-6 top-0 h-px bg-teal-700/70 dark:bg-teal-400/70" />
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</h3>
      {isLoading ? (
        <div className="mt-5 h-10 w-28 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      ) : (
        <b className={`mt-3 block tracking-tight text-slate-900 dark:text-white ${emphasis === 'primary' ? 'text-4xl' : 'text-3xl'}`}>
          {chartData?.todayValue ?? '0'}
        </b>
      )}
      {!isLoading && chartData && (
        <div className={`mt-3 ${emphasis === 'primary' ? 'h-24' : 'h-20'}`}>
          <Chart options={options} series={chartData.series} type="line" height={80} />
        </div>
      )}
      {!isLoading && !chartData && <p className="mt-5 text-sm text-slate-400">暂无可展示数据</p>}
    </section>
  );
}
