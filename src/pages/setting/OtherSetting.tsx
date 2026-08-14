import { useState } from 'react';
import { Button, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import Field from '../../components/Field';
import SettingCard from './SettingCard';

interface Props {
  options: Record<string, string>;
  saving: string | null;
  save: (key: string, value: string) => Promise<void>;
}

/** 其他设置：公告 / 系统名称 / 主题 / Logo / 首页内容 / 关于 / 页脚。 */
export default function OtherSetting({ options, saving, save }: Props) {
  const { showToast } = useToastContext();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const value = (key: string) => draft[key] ?? options[key] ?? '';
  const setValue = (key: string, v: string) => setDraft((prev) => ({ ...prev, [key]: v }));

  const submit = async (key: string) => {
    try {
      await save(key, value(key));
      showToast({ message: '保存成功', severity: NotificationSeverity.SUCCESS });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '保存失败', severity: NotificationSeverity.ERROR });
    }
  };

  const checkUpdate = async () => {
    try {
      const res = await fetch('https://api.github.com/repos/songquanpeng/one-api/releases/latest');
      const data = (await res.json()) as { tag_name: string };
      showToast({ message: `最新版本：${data.tag_name}`, severity: NotificationSeverity.SUCCESS });
    } catch {
      showToast({ message: '检查更新失败', severity: NotificationSeverity.ERROR });
    }
  };

  return (
    <div className="space-y-6">
      <SettingCard title="通用设置">
        <Button variant="outline" onClick={checkUpdate}>检查更新</Button>
        <Field label="公告"><textarea rows={8} value={value('Notice')} onChange={(e) => setValue('Notice', e.target.value)} placeholder="在此输入新的公告内容，支持 Markdown & HTML 代码" /></Field>
        <Button disabled={saving === 'Notice'} onClick={() => submit('Notice')}>保存公告</Button>
      </SettingCard>

      <SettingCard title="个性化设置">
        <Field label="系统名称"><input value={value('SystemName')} onChange={(e) => setValue('SystemName', e.target.value)} placeholder="在此输入系统名称" /></Field>
        <Button disabled={saving === 'SystemName'} onClick={() => submit('SystemName')}>设置系统名称</Button>

        <Field label="主题名称"><input value={value('Theme')} onChange={(e) => setValue('Theme', e.target.value)} placeholder="请输入主题名称" /></Field>
        <Button disabled={saving === 'Theme'} onClick={() => submit('Theme')}>设置主题（重启生效）</Button>

        <Field label="Logo 图片地址"><input value={value('Logo')} onChange={(e) => setValue('Logo', e.target.value)} placeholder="在此输入 Logo 图片地址" /></Field>
        <Button disabled={saving === 'Logo'} onClick={() => submit('Logo')}>设置 Logo</Button>

        <Field label="首页内容"><textarea rows={8} value={value('HomePageContent')} onChange={(e) => setValue('HomePageContent', e.target.value)} placeholder="在此输入首页内容，支持 Markdown & HTML。若输入链接则作为 iframe src。" /></Field>
        <Button disabled={saving === 'HomePageContent'} onClick={() => submit('HomePageContent')}>保存首页内容</Button>

        <Field label="关于"><textarea rows={8} value={value('About')} onChange={(e) => setValue('About', e.target.value)} placeholder="在此输入新的关于内容，支持 Markdown & HTML。" /></Field>
        <Button disabled={saving === 'About'} onClick={() => submit('About')}>保存关于</Button>

        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          移除 One API 的版权标识必须首先获得授权，项目维护需要花费大量精力，如果本项目对你有意义，请主动支持本项目。
        </div>

        <Field label="页脚"><textarea rows={8} value={value('Footer')} onChange={(e) => setValue('Footer', e.target.value)} placeholder="在此输入新的页脚，留空则使用默认页脚，支持 HTML 代码" /></Field>
        <Button disabled={saving === 'Footer'} onClick={() => submit('Footer')}>设置页脚</Button>
      </SettingCard>
    </div>
  );
}
