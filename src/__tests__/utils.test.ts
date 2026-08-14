import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  calculateQuota,
  displayInCurrency,
  formatQuota,
  formatTime,
  quotaPerUnit,
  renderNumber,
  renderQuota,
} from '~/api/oneApi';

/** Node 环境无 localStorage，注入内存实现供 quotaPerUnit / displayInCurrency 读取。 */
function installStorage(entries: Record<string, string> = {}) {
  const store = new Map(Object.entries(entries));
  const localStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  };
  vi.stubGlobal('localStorage', localStorage);
}

describe('renderNumber', () => {
  it('小数值原样返回', () => {
    expect(renderNumber(123)).toBe('123');
  });

  it('超过一万缩写为 k', () => {
    expect(renderNumber(12345)).toBe('12.3k');
  });

  it('超过一百万缩写为 M', () => {
    expect(renderNumber(1500000)).toBe('1.5M');
  });

  it('超过十亿缩写为 B', () => {
    expect(renderNumber(2000000000)).toBe('2.0B');
  });
});

describe('formatTime', () => {
  it('空值返回永不过期', () => {
    expect(formatTime(0)).toBe('永不过期');
    expect(formatTime(-1)).toBe('永不过期');
  });

  it('合法时间戳返回可读字符串', () => {
    const result = formatTime(1700000000);
    expect(typeof result).toBe('string');
    expect(result).not.toBe('永不过期');
  });
});

describe('formatQuota', () => {
  it('零值不抛错', () => {
    expect(typeof formatQuota(0)).toBe('string');
  });

  it('大额返回紧凑字符串', () => {
    expect(typeof formatQuota(1234567)).toBe('string');
  });
});

describe('quotaPerUnit / calculateQuota / renderQuota', () => {
  beforeEach(() => installStorage());

  it('未配置时回退默认 500000', () => {
    expect(quotaPerUnit()).toBe(500000);
  });

  it('读取 localStorage 中的配额单位', () => {
    installStorage({ quota_per_unit: '1000000' });
    expect(quotaPerUnit()).toBe(1000000);
  });

  it('非法值回退默认', () => {
    installStorage({ quota_per_unit: 'not-a-number' });
    expect(quotaPerUnit()).toBe(500000);
  });

  it('按单位换算金额', () => {
    installStorage({ quota_per_unit: '500000' });
    expect(calculateQuota(1000000)).toBe('2.00');
  });

  it('货币模式渲染 $ 前缀', () => {
    installStorage({ quota_per_unit: '500000', display_in_currency: 'true' });
    expect(displayInCurrency()).toBe(true);
    expect(renderQuota(1000000)).toBe('$2.00');
  });

  it('非货币模式渲染紧凑数字', () => {
    installStorage({ quota_per_unit: '500000' });
    expect(displayInCurrency()).toBe(false);
    expect(renderQuota(1000000)).toBe('1.0M');
  });
});
