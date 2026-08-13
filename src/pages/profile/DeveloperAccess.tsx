import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Button } from '@librechat/client';
export default function DeveloperAccess() { return <section className="rounded-2xl border bg-white p-6 dark:bg-slate-900"><h3 className="text-lg font-bold">开发者接入</h3><pre className="mt-6 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">POST /v1/chat/completions</pre><Link to="/panel/token"><Button className="mt-5"><KeyRound className="size-4"/>管理令牌</Button></Link></section>; }
