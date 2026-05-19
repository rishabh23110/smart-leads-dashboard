import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']),
});

type FormData = z.infer<typeof schema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, isAuthenticated, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'sales' },
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch {
      toast.error(useAuthStore.getState().error ?? 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-indigo-600" />
          <span className="text-xl font-bold text-slate-900">Smart Leads</span>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Create account</h2>
          <p className="mb-8 text-sm text-slate-500">Fill in the details below to get started.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register('name')}
              label="Full name"
              placeholder="John Doe"
              error={errors.name?.message}
              leftIcon={<User className="h-4 w-4" />}
              autoComplete="name"
            />
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
              autoComplete="new-password"
            />
            <Select
              {...register('role')}
              label="Role"
              options={[
                { value: 'sales', label: 'Sales User' },
                { value: 'admin', label: 'Admin' },
              ]}
              error={errors.role?.message}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
