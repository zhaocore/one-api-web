import { useState } from 'react';
import { Button, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { apiDelete } from '~/api/oneApi';
import Field from '../../components/Field';
import SettingCard from './SettingCard';

interface Props {
  options: Record<string, string>;
  saving: string | null;
  save: (key: string, value: string) => Promise<void>;
  saveMany: (entries: [string, string][]) => Promise<void>;
}

/** 运营设置：通用 / 日志 / 监控 / 额度 / 倍率。 */
export default function OperationSetting({ options, saving, save, saveMany }: Props) {
  const { showToast } = useToastContext();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [historyTimestamp, setHistoryTimestamp] = useState(() => Math.floor(Date.now() / 1000) - 30 * 24 * 3600);

  const value = (key: string) => draft[key] ?? options[key] ?? '';
  const setValue = (key: string, v: string) => setDraft((prev) => ({ ...prev, [key]: v }));
  const enabled = (key: string) => options[key] === 'true';

  const toggle = async (key: string) => {
    try {
      await save(key, enabled(key) ? 'false' : 'true');
      showToast({ message: '设置成功', severity: NotificationSeverity.SUCCESS });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '保存失败', severity: NotificationSeverity.ERROR });
    }
  };

  const submit = async (group: 'general' | 'monitor' | 'quota' | 'ratio', entries: [string, string][]) => {
    // 倍率组先校验 JSON
    if (group === 'ratio') {
      for (const [key, v] of entries) {
        try {
          JSON.parse(v);
        } catch {
          showToast({ message: `${key} 不是合法的 JSON 字符串`, severity: NotificationSeverity.ERROR });
          return;
        }
      }
    }
    try {
      await saveMany(entries);
      showToast({ message: '保存成功', severity: NotificationSeverity.SUCCESS });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '保存失败', severity: NotificationSeverity.ERROR });
    }
  };

  const clearLogs = async () => {
    try {
      const data = await apiDelete<number>(`/api/log/?target_timestamp=${Math.floor(historyTimestamp)}`);
      showToast({ message: `${data} 条日志已清理`, severity: NotificationSeverity.SUCCESS });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '清理失败', severity: NotificationSeverity.ERROR });
    }
  };

  const toTimestamp = (local: string) => (local ? Math.floor(new Date(local).getTime() / 1000) : 0);
  const toLocal = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 16);

  return (
    <div className="space-y-6">
      <SettingCard title="通用设置">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="充值链接"><input value={value('TopUpLink')} onChange={(e) => setValue('TopUpLink', e.target.value)} placeholder="例如发卡网站的购买链接" /></Field>
          <Field label="聊天链接"><input value={value('ChatLink')} onChange={(e) => setValue('ChatLink', e.target.value)} placeholder="例如 ChatGPT Next Web 的部署地址" /></Field>
          <Field label="单位额度"><input type="number" value={value('QuotaPerUnit')} onChange={(e) => setValue('QuotaPerUnit', e.target.value)} placeholder="一单位货币能兑换的额度" /></Field>
          <Field label="重试次数"><input type="number" value={value('RetryTimes')} onChange={(e) => setValue('RetryTimes', e.target.value)} placeholder="重试次数" /></Field>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('DisplayInCurrencyEnabled')} aria-label="以货币形式显示额度" onCheckedChange={() => toggle('DisplayInCurrencyEnabled')} />以货币形式显示额度</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('DisplayTokenStatEnabled')} aria-label="Billing API 显示令牌额度" onCheckedChange={() => toggle('DisplayTokenStatEnabled')} />Billing 相关 API 显示令牌额度而非用户额度</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('ApproximateTokenEnabled')} aria-label="使用近似方式估算 token" onCheckedChange={() => toggle('ApproximateTokenEnabled')} />使用近似的方式估算 token 数</label>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit('general', [['TopUpLink', value('TopUpLink')], ['ChatLink', value('ChatLink')], ['QuotaPerUnit', value('QuotaPerUnit')], ['RetryTimes', value('RetryTimes')]])}>保存通用设置</Button>
      </SettingCard>

      <SettingCard title="日志设置">
        <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('LogConsumeEnabled')} aria-label="启用日志消费" onCheckedChange={() => toggle('LogConsumeEnabled')} />启用日志消费</label>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="日志清理时间（此时间之前）"><input type="datetime-local" value={toLocal(historyTimestamp)} onChange={(e) => setHistoryTimestamp(toTimestamp(e.target.value))} /></Field>
          <Button variant="outline" onClick={clearLogs}>清理历史日志</Button>
        </div>
      </SettingCard>

      <SettingCard title="监控设置">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="最长响应时间（秒）"><input type="number" value={value('ChannelDisableThreshold')} onChange={(e) => setValue('ChannelDisableThreshold', e.target.value)} placeholder="超过此时间将自动禁用渠道" /></Field>
          <Field label="额度提醒阈值"><input type="number" value={value('QuotaRemindThreshold')} onChange={(e) => setValue('QuotaRemindThreshold', e.target.value)} placeholder="低于此额度时发送邮件提醒" /></Field>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('AutomaticDisableChannelEnabled')} aria-label="失败时自动禁用渠道" onCheckedChange={() => toggle('AutomaticDisableChannelEnabled')} />失败时自动禁用渠道</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('AutomaticEnableChannelEnabled')} aria-label="成功时自动启用渠道" onCheckedChange={() => toggle('AutomaticEnableChannelEnabled')} />成功时自动启用渠道</label>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit('monitor', [['ChannelDisableThreshold', value('ChannelDisableThreshold')], ['QuotaRemindThreshold', value('QuotaRemindThreshold')]])}>保存监控设置</Button>
      </SettingCard>

      <SettingCard title="额度设置">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="新用户初始额度"><input type="number" value={value('QuotaForNewUser')} onChange={(e) => setValue('QuotaForNewUser', e.target.value)} placeholder="例如：100" /></Field>
          <Field label="请求预扣费额度"><input type="number" value={value('PreConsumedQuota')} onChange={(e) => setValue('PreConsumedQuota', e.target.value)} placeholder="请求结束后多退少补" /></Field>
          <Field label="邀请新用户奖励额度"><input type="number" value={value('QuotaForInviter')} onChange={(e) => setValue('QuotaForInviter', e.target.value)} placeholder="例如：2000" /></Field>
          <Field label="新用户使用邀请码奖励额度"><input type="number" value={value('QuotaForInvitee')} onChange={(e) => setValue('QuotaForInvitee', e.target.value)} placeholder="例如：1000" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit('quota', [['QuotaForNewUser', value('QuotaForNewUser')], ['PreConsumedQuota', value('PreConsumedQuota')], ['QuotaForInviter', value('QuotaForInviter')], ['QuotaForInvitee', value('QuotaForInvitee')]])}>保存额度设置</Button>
      </SettingCard>

      <SettingCard title="倍率设置">
        <Field label="模型倍率"><textarea rows={5} value={value('ModelRatio')} onChange={(e) => setValue('ModelRatio', e.target.value)} placeholder="JSON 文本，键为模型名称，值为倍率" /></Field>
        <Field label="补全倍率"><textarea rows={5} value={value('CompletionRatio')} onChange={(e) => setValue('CompletionRatio', e.target.value)} placeholder="JSON 文本，键为模型名称，值为补全倍率" /></Field>
        <Field label="分组倍率"><textarea rows={5} value={value('GroupRatio')} onChange={(e) => setValue('GroupRatio', e.target.value)} placeholder="JSON 文本，键为分组名称，值为倍率" /></Field>
        <Button disabled={saving === 'batch'} onClick={() => submit('ratio', [['ModelRatio', value('ModelRatio')], ['CompletionRatio', value('CompletionRatio')], ['GroupRatio', value('GroupRatio')]])}>保存倍率设置</Button>
      </SettingCard>
    </div>
  );
}
