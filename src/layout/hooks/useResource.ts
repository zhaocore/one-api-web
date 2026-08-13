import { useEffect, useState } from 'react';
import { request } from '~/api/oneApi';

export function useResource<T>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await request<T[]>(path, { method: 'GET' }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '无法加载数据');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void reload();
  }, [path]);
  return { data, loading, error, reload };
}
