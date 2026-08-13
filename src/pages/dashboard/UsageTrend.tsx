export default function UsageTrend() {
  return (
    <section className="rounded-2xl border bg-white p-5 dark:bg-slate-900">
      <h3 className="font-bold">近期调用趋势</h3>
      <div className="mt-8 flex h-48 items-end gap-3">
        {[35, 58, 42, 82, 55, 73, 63].map((height, index) => (
          <div key={index} className="flex h-full flex-1 flex-col justify-end">
            <div style={{ height: `${height}%` }} className="rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-300" />
          </div>
        ))}
      </div>
    </section>
  );
}
