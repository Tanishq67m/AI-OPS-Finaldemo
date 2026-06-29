import React, { useState } from 'react';
import { Layers, Lock, User, AlertTriangle, Shield, Wrench } from 'lucide-react';

export function LoginPage({ onLogin, onBack }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin({
          username: 'admin',
          role: 'System Administrator',
          defaultSystem: 'production'
        });
      } else if (username === 'operator' && password === 'operator') {
        onLogin({
          username: 'operator',
          role: 'Field Engineer',
          defaultSystem: 'host'
        });
      } else {
        setError('Invalid operator credentials. Access denied.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-[#070A13] flex flex-col items-center justify-center text-slate-100 px-4 overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      
      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-dark-800/80 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-xl" />

        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Layers className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-xl font-black tracking-wider uppercase text-white">Security Gateway</h2>
          <p className="mt-1 text-xs text-slate-400">Enter operator credentials to access the AI-OPS Command Center</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operator ID</label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or operator"
                className="block w-full rounded-xl border border-slate-800 bg-[#0c1020] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security Key</label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-800 bg-[#0c1020] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Operator Guide Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4.5 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-300">Available Operator Profiles:</p>
            <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-blue-400" /> admin / admin</span>
              <span className="text-slate-500">System Administrator</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1"><Wrench className="h-3 w-3 text-emerald-400" /> operator / operator</span>
              <span className="text-slate-500">Field Engineer</span>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Authenticate Access'
            )}
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-4 text-center text-xs text-slate-500 hover:text-slate-300 transition-all font-semibold"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
}
export default LoginPage;
