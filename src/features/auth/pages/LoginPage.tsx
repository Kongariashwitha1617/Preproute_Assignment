import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate } from 'react-router-dom';
import { PrepRouteLogo } from '@/components/brand/PrepRouteLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden flex-1 items-center justify-center bg-surface px-10 lg:flex">
        <img
          src="/login-illustration.png"
          alt=""
          className="max-h-[380px] w-full max-w-[460px] object-contain"
        />
      </div>

      <div className="flex min-h-screen flex-1 items-center justify-center border-[#E2E8F0] bg-white px-6 py-10 sm:border-l sm:px-12 lg:px-16">
        <div className="w-full max-w-[400px]">
          <PrepRouteLogo className="mb-10" size="md" />

          <div className="mb-8">
            <h1 className="figma-heading">Login</h1>
            <p className="figma-subtext mt-2">
              Use your company provided Login credentials
            </p>
          </div>

          <form
            onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
            className="space-y-6"
          >
            <Input
              label="User ID"
              placeholder="Enter User ID"
              autoComplete="username"
              error={errors.userId?.message}
              {...register('userId')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter Password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="mt-3">
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full"
              size="lg"
              isLoading={loginMutation.isPending}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
