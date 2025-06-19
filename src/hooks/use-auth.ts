import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userRole: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole');

        console.log('useAuth - Token exists:', !!authToken);
        console.log('useAuth - User role:', userRole);

        const isAuthenticated = !!authToken && userRole === 'admin';

        console.log('useAuth - Is authenticated:', isAuthenticated);

        setAuthState({
          isAuthenticated,
          isLoading: false,
          userRole,
        });
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userRole: null,
        });
      }
    };

    // Verificar inicialmente
    checkAuth();

    // Escuchar cambios en el localStorage (cuando se cambia desde otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userRole') {
        console.log('Storage changed, rechecking auth');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return authState;
};

export default useAuth;
