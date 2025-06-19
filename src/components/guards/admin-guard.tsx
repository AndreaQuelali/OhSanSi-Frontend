import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/use-auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected.current) {
      console.log('AdminGuard - Redirecting to login from:', location.pathname);
      hasRedirected.current = true;
      navigate('/login', { replace: true });
    }

    if (isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-primary">Verificando autenticación...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
