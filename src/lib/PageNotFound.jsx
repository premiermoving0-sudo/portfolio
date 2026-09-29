import { Link, useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-slate-300">404</h1>
        <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
        <h2 className="text-2xl font-medium text-slate-800">Page not found</h2>
        <p className="text-slate-600">
          <span className="font-medium text-slate-700">{pathname}</span> doesn&rsquo;t exist.
        </p>
        <Link to="/" className="inline-block px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          Go home
        </Link>
      </div>
    </div>
  );
}
