import { apiGet } from '~/api/oneApi';

/** 获取 OAuth 授权所需的 state 参数。失败返回空字符串。 */
async function getOAuthState(): Promise<string> {
  try {
    const state = await apiGet<string>('/api/oauth/state');
    return state;
  } catch {
    return '';
  }
}

/** GitHub OAuth：跳转授权页。 */
export async function onGitHubOAuthClicked(githubClientId: string): Promise<void> {
  const state = await getOAuthState();
  if (!state) return;
  const url = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&state=${state}&scope=user:email`;
  window.location.href = url;
}

/** 飞书 OAuth：跳转授权页。 */
export async function onLarkOAuthClicked(larkClientId: string): Promise<void> {
  const state = await getOAuthState();
  if (!state) return;
  const redirectUri = `${window.location.origin}/oauth/lark`;
  window.location.href = `https://accounts.feishu.cn/open-apis/authen/v1/authorize?redirect_uri=${redirectUri}&client_id=${larkClientId}&state=${state}`;
}

/** OIDC OAuth：跳转授权页。 */
export async function onOidcClicked(authUrl: string, clientId: string): Promise<void> {
  const state = await getOAuthState();
  if (!state) return;
  const redirectUri = `${window.location.origin}/oauth/oidc`;
  const url = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid profile email&state=${state}`;
  window.location.href = url;
}
