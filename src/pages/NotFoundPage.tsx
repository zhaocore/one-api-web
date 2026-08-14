import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-6xl font-black text-teal-700">404</p>
      <h1 className="text-2xl font-bold">页面不存在</h1>
      <p className="max-w-sm text-slate-500">你访问的页面可能已被移动、删除，或地址输入有误。</p>
      <Link to="/panel/dashboard" className="mt-2 rounded-xl bg-teal-700 px-5 py-2.5 font-semibold text-white">
        返回总览
      </Link>
    </div>
  );
}
