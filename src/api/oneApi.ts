import { getDefaultStore } from 'jotai';
import { accountAtom } from '~/store';

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
  github_id: string;
  wechat_id: string;
  role: number;
  status: number;
  quota: number;
  used_quota: number;
  request_count: number;
  group: string;
  created_time: number;
}

/** 用户角色 → 展示名称。 */
export const ROLE_TEXT: Record<number, string> = {
  1: '普通用户',
  10: '管理员',
  100: '超级管理员',
};

export interface SiteInfo {
  system_name: string;
  logo: string;
  version: string;
  chat_link: string;
  footer_html: string;
  quota_per_unit: number;
  display_in_currency: boolean;
  email_verification: boolean;
  github_oauth: boolean;
  github_client_id: string;
  lark_login: boolean;
  lark_client_id: string;
  oidc: boolean;
  oidc_client_id: string;
  oidc_authorization_endpoint: string;
  oidc_token_endpoint: string;
  oidc_userinfo_endpoint: string;
  wechat_login: boolean;
  wechat_qrcode: string;
  turnstile_check: boolean;
  turnstile_site_key: string;
  top_up_link: string;
  server_address: string;
  start_time: number;
}

export interface Redemption {
  id: number;
  name: string;
  key: string;
  status: number;
  quota: number;
  count: number;
  used_count: number;
  created_time: number;
  redeemed_time: number;
}

/** 兑换码状态文本映射。 */
export const REDEMPTION_STATUS: Record<number, string> = {
  1: '未使用',
  2: '已禁用',
  3: '已使用',
};

/** 仪表盘按日/模型聚合的统计数据项（对应后端 /api/user/dashboard 返回）。 */
export interface LogStatistic {
  Day: string;
  ModelName: string;
  RequestCount: number;
  Quota: number;
  PromptTokens: number;
  CompletionTokens: number;
}

export interface TokenDetail {
  id: number;
  name: string;
  key: string;
  status: number;
  remain_quota: number;
  used_quota: number;
  unlimited_quota: boolean;
  expired_time: number;
  accessed_time: number;
  created_time: number;
}

export interface Channel {
  id: number;
  name: string;
  type: number;
  key: string;
  status: number;
  group: string;
  models: string;
  model_mapping: string;
  base_url: string;
  priority: number;
  weight: number;
  response_time: number;
  test_time: number;
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
  created_time: number;
  models: string;
  subnet: string;
}

/** 渠道类型 → 展示名称映射，与 Berry 参考实现保持一致。 */
export const CHANNEL_OPTIONS: Record<number, string> = {
  1: 'OpenAI',
  2: '代理：API2D',
  3: 'Azure OpenAI',
  4: '代理：CloseAI',
  5: '代理：OpenAI-SB',
  6: '代理：OpenAI Max',
  7: '代理：OhMyGPT',
  8: '自定义渠道',
  9: '代理：AI.LS',
  10: '代理：AI Proxy',
  11: 'Google PaLM2',
  12: '代理：API2GPT',
  13: '代理：AIGC2D',
  14: 'Anthropic Claude',
  15: '百度文心千帆',
  16: '智谱 ChatGLM',
  17: '阿里通义千问',
  18: '讯飞星火认知',
  19: '360 智脑',
  20: 'OpenRouter',
  21: '知识库：AI Proxy',
  22: '知识库：FastGPT',
  23: '腾讯混元',
  24: 'Google Gemini',
  25: 'Moonshot AI',
  26: '百川大模型',
  27: 'MiniMax',
  28: 'Mistral AI',
  29: 'Groq',
  30: 'Ollama',
  31: '零一万物',
  32: '阶跃星辰',
  33: 'AWS',
  34: 'Coze',
  35: 'Cohere',
  36: 'DeepSeek',
  37: 'Cloudflare',
  38: 'DeepL',
  39: 'together.ai',
  40: '字节火山引擎',
  41: 'Novita',
  42: 'VertexAI',
  43: 'Proxy',
  44: 'SiliconFlow',
  45: 'xAI',
  46: 'Replicate',
};

export interface Log {
  id: number;
  username: string;
  token_name: string;
  model_name: string;
  quota: number;
  prompt_tokens: number;
  completion_tokens: number;
  channel: number;
  content: string;
  created_at: number;
  elapsed_time: number;
  type: number;
}

/** 日志类型 → 展示名称，与 Berry LogType 一致。 */
export const LOG_TYPE: Record<number, string> = {
  0: '全部',
  1: '充值',
  2: '消费',
  3: '管理',
  4: '系统',
  5: '测试',
};

export interface Option {
  key: string;
  value: string;
}

const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';

const AUTH_STORAGE_KEY = 'user';

/** 后端错误 → 用户可读中文提示映射。 */
function httpStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return '请求参数错误';
    case 401:
      return '登录已失效，请重新登录';
    case 403:
      return '无权限执行此操作';
    case 404:
      return '接口不存在';
    case 405:
      return '本站仅作演示之用';
    case 429:
      return '请求次数过多，请稍后再试';
    case 500:
      return '服务器内部错误';
    default:
      return `请求失败 (${status})`;
  }
}

/** 清除本地登录态并硬跳转到登录页。用于 401 自动登出。 */
export function forceLogout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  getDefaultStore().set(accountAtom, null);
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

/** 请求 One API 服务端并返回其标准响应。 */
export async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init.headers },
      ...init,
    });
  } catch (reason) {
    // 网络层失败（后端不可达 / 断网 / 超时）
    throw new Error('网络连接失败，请检查网络或后端服务是否可用');
  }

  if (response.status === 401) {
    forceLogout();
    throw new Error(httpStatusMessage(401));
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    if (!response.ok) {
      throw new Error(httpStatusMessage(response.status));
    }
    throw new Error('服务端返回了无法解析的数据');
  }

  if (!response.ok || !payload.success) {
    const message = payload.message || httpStatusMessage(response.status);
    throw new Error(message);
  }
  return payload.data;
}

/** GET 请求便捷封装。 */
export function apiGet<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const query = params ? `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}` : '';
  return request<T>(`${path}${query}`, { method: 'GET' });
}

/** POST 请求便捷封装。 */
export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
}

/** PUT 请求便捷封装。 */
export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) });
}

/** DELETE 请求便捷封装。 */
export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

/** 拉取全部站点配置项，返回 key → value 映射。 */
export async function getOptions(): Promise<Record<string, string>> {
  const list = await apiGet<Option[]>('/api/option/');
  const result: Record<string, string> = {};
  for (const item of list) result[item.key] = item.value;
  return result;
}

/** 更新单个站点配置项。 */
export function updateOption(key: string, value: string): Promise<void> {
  return apiPut<void>('/api/option/', { key, value });
}

/** 从 URL 读取邀请码 aff 参数（存在则缓存到 localStorage 并返回）。 */
export function getAffCode(): string {
  const params = new URLSearchParams(window.location.search);
  const affCode = params.get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
    return affCode;
  }
  return localStorage.getItem('aff') ?? '';
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

/** 每个额度单位对应的金额（分），默认 500000，与站点配置 quota_per_unit 一致。 */
export function quotaPerUnit(): number {
  const stored = localStorage.getItem('quota_per_unit');
  const parsed = parseFloat(stored ?? '');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 500000;
}

/** 将后端原始额度换算为金额，保留指定小数位。 */
export function calculateQuota(quota: number, digits: number = 2): string {
  return (quota / quotaPerUnit()).toFixed(digits);
}

/** 是否以货币（美元）形式展示额度。 */
export function displayInCurrency(): boolean {
  return localStorage.getItem('display_in_currency') === 'true';
}

/**
 * 渲染额度：货币模式返回 `$x.xx`，否则返回紧凑数字。
 * 与 Berry 参考实现的 renderQuota 行为一致。
 */
export function renderQuota(quota: number, digits: number = 2): string {
  if (displayInCurrency()) {
    return '$' + calculateQuota(quota, digits);
  }
  return renderNumber(quota);
}

/** 大数字缩写渲染：B / M / k。 */
export function renderNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 10000) return (num / 1000).toFixed(1) + 'k';
  return String(num);
}

/** 复制文本到剪贴板，失败时回退到 execCommand。 */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
