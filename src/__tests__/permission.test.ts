import { beforeEach, describe, expect, it } from 'vitest';
import { getDefaultStore } from 'jotai';
import { accountAtom } from '~/store';
import { hasAdminRole, isAdmin, isRoot, ROLE_ADMIN, ROLE_ROOT } from '~/utils/permission';
import type { User } from '~/api/oneApi';

function makeUser(role: number): User {
  return {
    id: 1,
    username: 'tester',
    display_name: 'tester',
    email: '',
    github_id: '',
    wechat_id: '',
    role,
    status: 1,
    quota: 0,
    used_quota: 0,
    request_count: 0,
    group: 'default',
    created_time: 0,
  };
}

describe('权限判断', () => {
  beforeEach(() => {
    getDefaultStore().set(accountAtom, null);
  });

  it('未登录时 isAdmin / isRoot 均为 false', () => {
    expect(isAdmin()).toBe(false);
    expect(isRoot()).toBe(false);
  });

  it('普通用户 (role=1) 无管理员权限', () => {
    getDefaultStore().set(accountAtom, makeUser(1));
    expect(isAdmin()).toBe(false);
    expect(isRoot()).toBe(false);
  });

  it('管理员 (role=10) 具管理员权限但非超级管理员', () => {
    getDefaultStore().set(accountAtom, makeUser(ROLE_ADMIN));
    expect(isAdmin()).toBe(true);
    expect(isRoot()).toBe(false);
  });

  it('超级管理员 (role=100) 同时具备两种权限', () => {
    getDefaultStore().set(accountAtom, makeUser(ROLE_ROOT));
    expect(isAdmin()).toBe(true);
    expect(isRoot()).toBe(true);
  });

  it('hasAdminRole 对行级角色判定正确', () => {
    expect(hasAdminRole(1)).toBe(false);
    expect(hasAdminRole(10)).toBe(true);
    expect(hasAdminRole(100)).toBe(true);
  });
});
