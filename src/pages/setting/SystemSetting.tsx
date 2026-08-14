import { useState } from 'react';
import { Button, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import Field from '../../components/Field';
import SettingCard from './SettingCard';

interface Props {
  options: Record<string, string>;
  saving: string | null;
  save: (key: string, value: string) => Promise<void>;
  saveMany: (entries: [string, string][]) => Promise<void>;
}

/** 系统设置：服务器地址 / 登录注册 / 邮箱域名白名单 / SMTP / 各 OAuth / Message Pusher / Turnstile。 */
export default function SystemSetting({ options, saving, save, saveMany }: Props) {
  const { showToast } = useToastContext();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const value = (key: string) => draft[key] ?? options[key] ?? '';
  const setValue = (key: string, v: string) => setDraft((prev) => ({ ...prev, [key]: v }));
  const enabled = (key: string) => options[key] === 'true';

  const success = () => showToast({ message: '设置成功', severity: NotificationSeverity.SUCCESS });
  const fail = (reason: unknown) => showToast({ message: reason instanceof Error ? reason.message : '保存失败', severity: NotificationSeverity.ERROR });

  const toggle = async (key: string) => {
    try {
      await save(key, enabled(key) ? 'false' : 'true');
      success();
    } catch (reason) {
      fail(reason);
    }
  };

  const submit = async (entries: [string, string][]) => {
    try {
      await saveMany(entries);
      success();
    } catch (reason) {
      fail(reason);
    }
  };

  const trimTrailingSlash = (v: string) => v.replace(/\/+$/, '');

  return (
    <div className="space-y-6">
      <SettingCard title="通用设置">
        <Field label="服务器地址"><input value={value('ServerAddress')} onChange={(e) => setValue('ServerAddress', e.target.value)} placeholder="例如：https://yourdomain.com" /></Field>
        <Button disabled={saving === 'batch'} onClick={() => submit([['ServerAddress', trimTrailingSlash(value('ServerAddress'))]])}>更新服务器地址</Button>
      </SettingCard>

      <SettingCard title="配置登录注册">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('PasswordLoginEnabled')} aria-label="允许密码登录" onCheckedChange={() => toggle('PasswordLoginEnabled')} />允许通过密码进行登录</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('PasswordRegisterEnabled')} aria-label="允许密码注册" onCheckedChange={() => toggle('PasswordRegisterEnabled')} />允许通过密码进行注册</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('EmailVerificationEnabled')} aria-label="邮箱验证" onCheckedChange={() => toggle('EmailVerificationEnabled')} />通过密码注册时需要进行邮箱验证</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('GitHubOAuthEnabled')} aria-label="GitHub 登录" onCheckedChange={() => toggle('GitHubOAuthEnabled')} />允许通过 GitHub 账户登录 & 注册</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('OidcEnabled')} aria-label="OIDC 登录" onCheckedChange={() => toggle('OidcEnabled')} />允许通过 OIDC 登录 & 注册</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('WeChatAuthEnabled')} aria-label="微信登录" onCheckedChange={() => toggle('WeChatAuthEnabled')} />允许通过微信登录 & 注册</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('RegisterEnabled')} aria-label="允许新用户注册" onCheckedChange={() => toggle('RegisterEnabled')} />允许新用户注册（否时任何方式都无法注册）</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={enabled('TurnstileCheckEnabled')} aria-label="Turnstile 校验" onCheckedChange={() => toggle('TurnstileCheckEnabled')} />启用 Turnstile 用户校验</label>
        </div>
      </SettingCard>

      <SettingCard title="配置邮箱域名白名单" subtitle="用于防止恶意用户利用临时邮箱批量注册">
        <Field label="邮箱域名白名单（逗号分隔）"><input value={value('EmailDomainWhitelist')} onChange={(e) => setValue('EmailDomainWhitelist', e.target.value)} placeholder="例如：gmail.com,outlook.com" /></Field>
        <Button disabled={saving === 'batch'} onClick={() => submit([['EmailDomainWhitelist', value('EmailDomainWhitelist')]])}>保存邮箱域名白名单设置</Button>
      </SettingCard>

      <SettingCard title="配置 SMTP" subtitle="用于支持系统的邮件发送">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SMTP 服务器地址"><input value={value('SMTPServer')} onChange={(e) => setValue('SMTPServer', e.target.value)} placeholder="例如：smtp.qq.com" /></Field>
          <Field label="SMTP 端口"><input type="number" value={value('SMTPPort')} onChange={(e) => setValue('SMTPPort', e.target.value)} placeholder="默认: 587" /></Field>
          <Field label="SMTP 账户"><input value={value('SMTPAccount')} onChange={(e) => setValue('SMTPAccount', e.target.value)} placeholder="通常是邮箱地址" /></Field>
          <Field label="SMTP 发送者邮箱"><input value={value('SMTPFrom')} onChange={(e) => setValue('SMTPFrom', e.target.value)} placeholder="通常与邮箱地址一致" /></Field>
          <Field label="SMTP 访问凭证"><input type="password" value={value('SMTPToken')} onChange={(e) => setValue('SMTPToken', e.target.value)} placeholder="敏感信息不会发送到前端显示" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit([['SMTPServer', value('SMTPServer')], ['SMTPPort', value('SMTPPort')], ['SMTPAccount', value('SMTPAccount')], ['SMTPFrom', value('SMTPFrom')], ['SMTPToken', value('SMTPToken')]])}>保存 SMTP 设置</Button>
      </SettingCard>

      <SettingCard title="配置 GitHub OAuth App" subtitle="用于支持通过 GitHub 登录注册">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="GitHub Client ID"><input value={value('GitHubClientId')} onChange={(e) => setValue('GitHubClientId', e.target.value)} placeholder="输入你的 GitHub OAuth APP 的 ID" /></Field>
          <Field label="GitHub Client Secret"><input type="password" value={value('GitHubClientSecret')} onChange={(e) => setValue('GitHubClientSecret', e.target.value)} placeholder="敏感信息不会发送到前端显示" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit([['GitHubClientId', value('GitHubClientId')], ['GitHubClientSecret', value('GitHubClientSecret')]])}>保存 GitHub OAuth 设置</Button>
      </SettingCard>

      <SettingCard title="配置飞书授权登录" subtitle="用于支持通过飞书登录注册">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="App ID"><input value={value('LarkClientId')} onChange={(e) => setValue('LarkClientId', e.target.value)} placeholder="输入 App ID" /></Field>
          <Field label="App Secret"><input type="password" value={value('LarkClientSecret')} onChange={(e) => setValue('LarkClientSecret', e.target.value)} placeholder="敏感信息不会发送到前端显示" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit([['LarkClientId', value('LarkClientId')], ['LarkClientSecret', value('LarkClientSecret')]])}>保存飞书 OAuth 设置</Button>
      </SettingCard>

      <SettingCard title="配置 OIDC" subtitle="用于支持通过 OIDC 登录，例如 Okta、Auth0 等">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Client ID"><input value={value('OidcClientId')} onChange={(e) => setValue('OidcClientId', e.target.value)} placeholder="输入 OIDC 的 Client ID" /></Field>
          <Field label="Client Secret"><input type="password" value={value('OidcClientSecret')} onChange={(e) => setValue('OidcClientSecret', e.target.value)} placeholder="敏感信息不会发送到前端显示" /></Field>
          <Field label="Well-Known URL"><input value={value('OidcWellKnown')} onChange={(e) => setValue('OidcWellKnown', e.target.value)} placeholder="请输入 OIDC 的 Well-Known URL" /></Field>
          <Field label="Authorization Endpoint"><input value={value('OidcAuthorizationEndpoint')} onChange={(e) => setValue('OidcAuthorizationEndpoint', e.target.value)} placeholder="输入 Authorization Endpoint" /></Field>
          <Field label="Token Endpoint"><input value={value('OidcTokenEndpoint')} onChange={(e) => setValue('OidcTokenEndpoint', e.target.value)} placeholder="输入 Token Endpoint" /></Field>
          <Field label="Userinfo Endpoint"><input value={value('OidcUserinfoEndpoint')} onChange={(e) => setValue('OidcUserinfoEndpoint', e.target.value)} placeholder="输入 Userinfo Endpoint" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit([['OidcClientId', value('OidcClientId')], ['OidcClientSecret', value('OidcClientSecret')], ['OidcWellKnown', value('OidcWellKnown')], ['OidcAuthorizationEndpoint', value('OidcAuthorizationEndpoint')], ['OidcTokenEndpoint', value('OidcTokenEndpoint')], ['OidcUserinfoEndpoint', value('OidcUserinfoEndpoint')]])}>保存 OIDC 设置</Button>
      </SettingCard>

      <SettingCard title="配置 WeChat Server" subtitle="用于支持通过微信登录注册">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="WeChat Server 服务器地址"><input value={value('WeChatServerAddress')} onChange={(e) => setValue('WeChatServerAddress', e.target.value)} placeholder="例如：https://yourdomain.com" /></Field>
          <Field label="WeChat Server 访问凭证"><input type="password" value={value('WeChatServerToken')} onChange={(e) => setValue('WeChatServerToken', e.target.value)} placeholder="敏感信息不会发送到前端显示" /></Field>
          <Field label="微信公众号二维码图片链接"><input value={value('WeChatAccountQRCodeImageURL')} onChange={(e) => setValue('WeChatAccountQRCodeImageURL', e.target.value)} placeholder="输入一个图片链接" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit([['WeChatServerAddress', trimTrailingSlash(value('WeChatServerAddress'))], ['WeChatServerToken', value('WeChatServerToken')], ['WeChatAccountQRCodeImageURL', value('WeChatAccountQRCodeImageURL')]])}>保存 WeChat Server 设置</Button>
      </SettingCard>

      <SettingCard title="配置 Message Pusher" subtitle="用于推送报警信息">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Message Pusher 推送地址"><input value={value('MessagePusherAddress')} onChange={(e) => setValue('MessagePusherAddress', e.target.value)} placeholder="例如：https://msgpusher.com/push/your_username" /></Field>
          <Field label="Message Pusher 访问凭证"><input type="password" value={value('MessagePusherToken')} onChange={(e) => setValue('MessagePusherToken', e.target.value)} placeholder="敏感信息不会发送到前端显示" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit([['MessagePusherAddress', trimTrailingSlash(value('MessagePusherAddress'))], ['MessagePusherToken', value('MessagePusherToken')]])}>保存 Message Pusher 设置</Button>
      </SettingCard>

      <SettingCard title="配置 Turnstile" subtitle="用于支持用户校验">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Turnstile Site Key"><input value={value('TurnstileSiteKey')} onChange={(e) => setValue('TurnstileSiteKey', e.target.value)} placeholder="输入你注册的 Turnstile Site Key" /></Field>
          <Field label="Turnstile Secret Key"><input type="password" value={value('TurnstileSecretKey')} onChange={(e) => setValue('TurnstileSecretKey', e.target.value)} placeholder="敏感信息不会发送到前端显示" /></Field>
        </div>
        <Button disabled={saving === 'batch'} onClick={() => submit([['TurnstileSiteKey', value('TurnstileSiteKey')], ['TurnstileSecretKey', value('TurnstileSecretKey')]])}>保存 Turnstile 设置</Button>
      </SettingCard>
    </div>
  );
}
