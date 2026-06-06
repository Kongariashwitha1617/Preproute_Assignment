import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/client';
import { login } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest } from '@/types/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success('Login successful');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  return () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };
}
