import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { apiGet, type SiteInfo } from '~/api/oneApi';
import { siteInfoAtom } from '~/store';

/**
 * 加载并缓存站点公开信息（系统名称 / OAuth 配置等）。
 * 结果写入 siteInfoAtom，供登录页与全局布局复用。
 */
export function useSiteInfo() {
  const [siteInfo, setSiteInfo] = useAtom(siteInfoAtom);

  useEffect(() => {
    if (siteInfo) return;
    let cancelled = false;
    apiGet<SiteInfo>('/api/status')
      .then((info) => {
        if (cancelled) return;
        setSiteInfo(info);
        // 同步额度换算配置，供 calculateQuota / renderQuota 使用。
        localStorage.setItem('quota_per_unit', String(info.quota_per_unit));
        localStorage.setItem('display_in_currency', String(info.display_in_currency));
      })
      .catch(() => {
        // 站点信息加载失败不阻塞渲染，静默保留空值。
      });
    return () => {
      cancelled = true;
    };
  }, [siteInfo, setSiteInfo]);

  return siteInfo;
}
