import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { demoLogin } from '../../utils/demoData.js';

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const activeCred = useMemo(() => demoLogin.credentials[role], [role]);

  const applyDemoCredentials = (r) => {
    const c = demoLogin.credentials[r];
    setRole(r);
    setEmail(c.email);
    setPassword(c.password);
    setFieldErrors({});
    setError(null);
  };

  const validate = () => {
    const next = {};

    if (!email.trim()) next.email = 'Email is required.';
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.';

    if (!password) next.password = 'Password is required.';
    else if (String(password).length < 6) next.password = 'Password must be at least 6 characters.';

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login({ email, password });
      if (result.user.role === 'employee') navigate('/dashboard');
      else if (result.user.role === 'manager') navigate('/manager/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const Icon = ({ children }) => (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200 shadow-sm">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-6 sm:py-10">
      <div className="relative mx-auto h-full max-w-6xl">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-900" />
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        </div>

        {/* Centered content */}
        <div className="grid min-h-[calc(100vh-3rem)] items-center gap-6 lg:grid-cols-[1fr_460px]">
          {/* Left feature panel */}
          <section className="hidden rounded-[2rem] bg-white p-8 shadow-xl lg:block">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg" />
              <div>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-slate-700">Powered by Internal Performance Management</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.26em] text-slate-700">
                    Goal Management Platform
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">In-House Goal Setting &amp; Tracking Portal</h2>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              Align quarterly objectives across teams, track progress with transparency, and streamline approvals.
            </p>

            <div className="mt-7 grid gap-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Real-time workflow</p>
                    <p className="text-sm text-slate-600">Submit, review, and track goal sheets across roles.</p>
                  </div>
                  <Icon>
                    <span className="text-lg">⚡</span>
                  </Icon>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">KPI visibility</p>
                    <p className="text-sm text-slate-600">Monitor quarterly progress, completion, and performance signals.</p>
                  </div>
                  <Icon>
                    <span className="text-lg">📈</span>
                  </Icon>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Governance &amp; audit</p>
                    <p className="text-sm text-slate-600">Admin visibility into cycles, escalations, and audit activity.</p>
                  </div>
                  <Icon>
                    <span className="text-lg">🛡️</span>
                  </Icon>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm border-t-4 border-blue-600">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Completion</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">78%</div>
                <div className="mt-1 text-xs text-slate-600">Org-wide signal</div>
              </div>
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm border-t-4 border-blue-600">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Pending approvals</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">23</div>
                <div className="mt-1 text-xs text-slate-600">Awaiting review</div>
              </div>
            </div>

            <div className="mt-7 rounded-3xl bg-blue-600 px-5 py-4 text-sm text-white shadow-xl">
              <p className="font-semibold">Demo-ready onboarding</p>
              <p className="mt-2 text-blue-100/95">
                Use the role selector to auto-fill realistic demo credentials—then explore each dashboard.
              </p>
            </div>
          </section>

          {/* Right login panel */}
          <section className="rounded-[2rem] bg-white p-5 shadow-xl sm:p-7 lg:p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">Powered by Internal Performance Management</p>
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign in</h1>
              <p className="mt-2 text-sm text-slate-600">Select a role and sign in with demo credentials.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
              )}

              {/* Role selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {['employee', 'manager', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => applyDemoCredentials(r)}
                      className={
                        'rounded-2xl border px-3 py-2 text-sm font-semibold transition ' +
                        (role === r
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200')
                      }
                    >
                      {r[0].toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    'w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ' +
                    (fieldErrors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-blue-500')
                  }
                  placeholder={activeCred?.email || 'name@company.com'}
                />
                {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={
                      'w-full rounded-2xl border px-4 py-3 pr-28 text-sm outline-none transition ' +
                      (fieldErrors.password
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-blue-500')
                    }
                    placeholder={activeCred ? activeCred.password.replace(/./g, '•') : '••••••••'}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1 rounded-xl px-3 py-2 text-xs font-semibold text-blue-700 hover:text-blue-800"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
              </div>

              {/* Demo credentials card */}
              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Demo credentials</p>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Role: {role}</span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Email</span>
                    <span className="truncate font-semibold">{activeCred?.email}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Password</span>
                    <span className="truncate font-semibold">{activeCred?.password}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button type="submit" variant="primary" disabled={loading} className="w-full rounded-xl py-3 text-base">
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </div>

              {loading && (
                <div className="pt-2">
                  <LoadingSpinner />
                </div>
              )}

              <div className="text-center text-xs text-slate-700">Tip: Switch roles to explore dashboards.</div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

