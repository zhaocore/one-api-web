import { useCallback, useEffect, useState } from 'react';
import { getOptions, updateOption } from '~/api/oneApi';

/** 设置页共享逻辑：加载全部配置项 + 更新单个配置项。 */
export function useSettings() {
  const [options, setOptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOptions();
      setOptions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** 更新单个配置项，key 为当前正在保存的字段名（用于按钮 loading 态）。 */
  const save = useCallback(
    async (key: string, value: string) => {
      setSaving(key);
      try {
        await updateOption(key, value);
        setOptions((prev) => ({ ...prev, [key]: value }));
      } finally {
        setSaving(null);
      }
    },
    [],
  );

  /** 批量保存多个配置项。 */
  const saveMany = useCallback(
    async (entries: [string, string][]) => {
      setSaving('batch');
      try {
        for (const [key, value] of entries) {
          await updateOption(key, value);
          setOptions((prev) => ({ ...prev, [key]: value }));
        }
      } finally {
        setSaving(null);
      }
    },
    [],
  );

  return { options, loading, saving, load, save, saveMany };
}
