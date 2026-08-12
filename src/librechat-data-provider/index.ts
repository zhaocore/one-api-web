// Minimal stub — this module existed in the original project but has been removed.
// Only types that other modules depend on are preserved.

export type TUser = {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  role?: string;
};

export type TFile = {
  file_id: string;
  filename?: string;
  filepath?: string;
  type?: string;
  size?: number;
  metadata?: Record<string, unknown>;
};

export type TMessage = Record<string, unknown>;

export type TConversation = {
  conversationId?: string;
  title?: string;
  agent_id?: string;
  [key: string]: unknown;
};

export const Constants = {
  COMMON_DIVIDER: '__',
};

export const LocalStorageKeys = {
  AGENT_ID_PREFIX: 'agent_id_',
  LAST_CONVO_SETUP: 'lastConvoSetup',
  ENABLE_USER_MSG_MARKDOWN: 'enableUserMsgMarkdown',
};

export const QueryKeys = {
  messages: 'messages',
};

export function isEphemeralAgentId(_id: string): boolean {
  return false;
}
