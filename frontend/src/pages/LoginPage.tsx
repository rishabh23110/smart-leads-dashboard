import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error(useAuthStore.getState().error ?? 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold">Smart Leads</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          Manage your leads<br />smarter, faster.
        </h1>
        <p className="text-lg text-indigo-200 leading-relaxed">
          Track every lead from first contact to close. Built for modern sales teams.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-6">
          {[
            { label: 'Leads Tracked', value: '12,000+' },
            { label: 'Teams Using', value: '500+' },
            { label: 'Conversion Rate', value: '38%' },
            { label: 'Uptime', value: '99.9%' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/10 p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-indigo-200">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <BarChart3 className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-slate-900">Smart Leads</span>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-slate-900">Sign in</h2>
          <p className="mb-8 text-slate-500">Welcome back! Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register('email')}
              label="Email address"
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
            />
            <Input
              {...register('password')}
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
              Create one
            </Link>
          </p>

          <div className="mt-8 rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Demo Accounts</p>
            <div className="space-y-1 text-xs text-slate-600">
              <p><span className="font-medium">Admin:</span> admin@demo.com / password123</p>
              <p><span className="font-medium">Sales:</span> sales@demo.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
