import { formatQuota, formatTime, Token } from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import TableShell from '../../components/TableShell';
export default function TokenTable({ tokens, loading, reload }: { tokens: Token[]; loading: boolean; reload: () => Promise<void> }) { return <TableShell loading={loading}><table className="w-full text-left text-sm"><thead><tr><th>令牌名称</th><th>状态</th><th>剩余额度</th><th>已用额度</th><th>有效期</th></tr></thead><tbody>{tokens.map((item) => <tr key={item.id}><td><b>{item.name}</b><small className="block text-slate-400">sk-••••{item.key.slice(-6)}</small></td><td><StatusBadge value={item.status}/></td><td>{item.unlimited_quota?'不限额':formatQuota(item.remain_quota)}</td><td>{formatQuota(item.used_quota)}</td><td>{formatTime(item.expired_time)}</td></tr>)}</tbody></table>{!loading&&!tokens.length&&<EmptyState error="" label="令牌" reload={reload}/>}</TableShell>; }
