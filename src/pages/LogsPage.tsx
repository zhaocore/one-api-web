import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import { Log, LOG_TYPE, apiGet, formatQuota } from '~/api/oneApi';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import { isAdmin } from '~/utils/permission';
import { LogTable } from './log/LogTable';

const ITEMS_PER_PAGE = 10;

interface LogFilter {
  token_name: string;
  model_name: string;
  username: string;
  channel: string;
  type: number;
  start_timestamp: number;
  end_timestamp: number;
}

const INITIAL_FILTER: LogFilter = {
  token_name: '',
  model_name: '',
  username: '',
  channel: '',
  type: 0,
  start_timestamp: 0,
  end_timestamp: 0,
};

export default function LogsPage() {
  const admin = isAdmin();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<LogFilter>(INITIAL_FILTER);
  const [quota, setQuota] = useState(0);

  const basePath = admin ? '/api/log' : '/api/log/self';

  const load = async (nextPage: number) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = { p: nextPage, type: filter.type };
      if (filter.token_name) params.token_name = filter.token_name;
      if (filter.model_name) params.model_name = filter.model_name;
      if (filter.start_timestamp) params.start_timestamp = filter.start_timestamp;
      if (filter.end_timestamp) params.end_timestamp = filter.end_timestamp;
      if (admin) {
        if (filter.username) params.username = filter.username;
        if (filter.channel) params.channel = filter.channel;
      }
      const data = await apiGet<Log[]>(basePath, params);
      setLogs(data);
      setHasMore(data.length === ITEMS_PER_PAGE);
      setPage(nextPage);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '无法加载日志');
    } finally {
      setLoading(false);
    }
  };

  const loadStat = async () => {
    try {
      const params: Record<string, string | number> = { type: filter.type };
      if (filter.token_name) params.token_name = filter.token_name;
      if (filter.model_name) params.model_name = filter.model_name;
      if (filter.start_timestamp) params.start_timestamp = filter.start_timestamp;
      if (filter.end_timestamp) params.end_timestamp = filter.end_timestamp;
      if (admin) {
        if (filter.username) params.username = filter.username;
        if (filter.channel) params.channel = filter.channel;
      }
      const data = await apiGet<{ quota: number }>(`${basePath}/stat`, params);
      setQuota(data.quota);
    } catch {
      setQuota(0);
    }
  };

  useEffect(() => {
    void load(0);
    void loadStat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    void load(0);
    void loadStat();
  };

  const handleReset = () => {
    setFilter(INITIAL_FILTER);
    void load(0);
    void loadStat();
  };

  const setField = (key: keyof LogFilter, value: string | number) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const inputCls =
    'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900';

  return (
    <>
      <PageHeader
        title="调用日志"
        description="检索和追踪每一次模型调用。"
        action={
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="size-4" />
            刷新
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <input className={inputCls} placeholder="令牌名称" value={filter.token_name} onChange={(event) => setField('token_name', event.target.value)} />
        <input className={inputCls} placeholder="模型名称" value={filter.model_name} onChange={(event) => setField('model_name', event.target.value)} />
        {admin && (
          <>
            <input className={inputCls} placeholder="用户名称" value={filter.username} onChange={(event) => setField('username', event.target.value)} />
            <input className={inputCls} placeholder="渠道 ID" value={filter.channel} onChange={(event) => setField('channel', event.target.value)} />
          </>
        )}
        <select className={inputCls} value={filter.type} onChange={(event) => setField('type', Number(event.target.value))}>
          {Object.entries(LOG_TYPE).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <label className="text-sm text-slate-500">
          起始
          <input className={`${inputCls} ml-1`} type="datetime-local" onChange={(event) => setField('start_timestamp', event.target.value ? Math.floor(new Date(event.target.value).getTime() / 1000) : 0)} />
        </label>
        <label className="text-sm text-slate-500">
          结束
          <input className={`${inputCls} ml-1`} type="datetime-local" onChange={(event) => setField('end_timestamp', event.target.value ? Math.floor(new Date(event.target.value).getTime() / 1000) : 0)} />
        </label>
        <Button onClick={handleSearch}>搜索</Button>
      </div>
      <div className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
        已选条件下累计消费额度：<b>{formatQuota(quota)}</b>
      </div>
      {error ? (
        <EmptyState error={error} label="调用日志" reload={() => load(0)} />
      ) : (
        <LogTable logs={logs} loading={loading} reload={() => load(page)} admin={admin} />
      )}
      {!error && !loading && logs.length > 0 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="mr-2 text-sm text-slate-500">第 {page + 1} 页</span>
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => load(page - 1)}>
            <ChevronLeft className="size-4" />
            上一页
          </Button>
          <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => load(page + 1)}>
            下一页
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
}
