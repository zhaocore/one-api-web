import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import { User, apiGet } from '~/api/oneApi';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SearchToolbar from '../components/SearchToolbar';
import UserDialog from './user/UserDialog';
import UserTable from './user/UserTable';

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const load = async (nextPage: number, nextKeyword: string = keyword) => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet<User[]>(
        nextKeyword ? '/api/user/search' : '/api/user',
        nextKeyword ? { keyword: nextKeyword } : { p: nextPage },
      );
      setRows(data);
      setHasMore(!nextKeyword && data.length === ITEMS_PER_PAGE);
      setPage(nextPage);
      setKeyword(nextKeyword);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '无法加载用户');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(0, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => {
    if (value === keyword) return;
    void load(0, value);
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="用户管理"
        description="管理平台用户、角色与额度。"
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            新建用户
          </Button>
        }
      />
      <SearchToolbar onSearch={handleSearch}>
        <Button variant="outline" onClick={() => load(page)}>
          <RefreshCw className="size-4" />
          刷新
        </Button>
      </SearchToolbar>
      {error ? (
        <EmptyState error={error} label="用户" reload={() => load(0)} />
      ) : (
        <UserTable rows={rows} loading={loading} reload={() => load(page)} onEdit={openEdit} />
      )}
      {!error && !loading && rows.length > 0 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="mr-2 text-sm text-slate-500">第 {page + 1} 页</span>
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => load(page - 1)}>
            <ChevronLeft className="size-4" />
            上一页
          </Button>
          <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => load(page + 1)}>
            下一页
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
      <UserDialog open={open} onOpenChange={setOpen} onDone={() => load(page)} user={editing} />
    </>
  );
}
