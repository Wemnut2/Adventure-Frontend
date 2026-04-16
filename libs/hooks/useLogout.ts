// src/hooks/useLogout.ts
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useToast } from '@/libs/src/contexts/ToastContext';

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch (error) {
      showToast('Failed to logout', 'error');
    }
  };

  return { handleLogout };
}