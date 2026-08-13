export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  username: string;
  display_name: string;
  email: string;
  role: number;
  status: number;
  quota: number;
  used_quota: number;
  group: string;
  created_time: number;
}

export interface Channel {
  id: number;
  name: string;
  type: number;
  status: number;
  group: string;
  models: string;
  response_time: number;
  balance: number;
  used_quota: number;
}

export interface Token {
  id: number;
  name: string;
  key: string;
  status: number;
  remain_quota: number;
  used_quota: number;
  unlimited_quota: boolean;
  expired_time: number;
  accessed_time: number;
}

export interface Log {
  id: number;
  username: string;
  token_name: string;
  model_name: string;
  quota: number;
  prompt_tokens: number;
  completion_tokens: number;
  channel: number;
  created_at: number;
  elapsed_time: number;
  type: number;
}

export interface Option {
  key: string;
  value: string;
}

const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';

/** 请求 One API 服务端并返回其标准响应。 */
export async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init,
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `请求失败 (${response.status})`);
  }
  return payload.data;
}

/** 格式化后端以秒存储的时间戳。 */
export function formatTime(timestamp: number): string {
  if (!timestamp || timestamp < 0) return '永不过期';
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp * 1000);
}

/** 将额度从后端基础单位显示为便于阅读的数值。 */
export function formatQuota(quota: number): string {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2, notation: 'compact' }).format(quota ?? 0);
}
