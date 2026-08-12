import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <div className="flex h-dvh bg-surface-primary">
      <div className="relative flex h-full min-w-0 max-w-full flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
