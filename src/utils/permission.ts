import { getDefaultStore } from 'jotai';
import { accountAtom } from '~/store';

/**
 * 管理员角色编号。与后端 User.role 约定一致：
 * 1 = 普通用户，10 = 管理员，100 = 超级管理员。
 */
export const ROLE_ADMIN = 10;
export const ROLE_ROOT = 100;

/** 当前用户是否为管理员（含超级管理员）。 */
export function isAdmin(): boolean {
  const role = getDefaultStore().get(accountAtom)?.role ?? 1;
  return role >= ROLE_ADMIN;
}

/** 当前用户是否为超级管理员。 */
export function isRoot(): boolean {
  const role = getDefaultStore().get(accountAtom)?.role ?? 1;
  return role >= ROLE_ROOT;
}

/** 判断给定角色编号是否具备管理员权限，用于列表行级控制。 */
export function hasAdminRole(role: number): boolean {
  return role >= ROLE_ADMIN;
}
