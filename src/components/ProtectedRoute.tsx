
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Mostra um loader enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-estudo-primary"></div>
      </div>
    );
  }
  
  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
