
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session, User, UserAttributes } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  nome: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar sessão atual quando o componente é montado
  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          return;
        }
        
        if (data?.session) {
          await handleUserSession(data.session);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await handleUserSession(session);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função para processar os dados do usuário a partir da sessão
  const handleUserSession = async (session: Session) => {
    const supabaseUser = session.user;
    
    if (!supabaseUser) return;
    
    try {
      // Buscar perfil do usuário no perfis
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
        return;
      }
      
      // Se o perfil existe, usamos o nome dele, senão tentamos extrair do email
      const nome = data?.nome || supabaseUser.email?.split('@')[0] || 'Usuário';
      
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        nome: nome
      });
    } catch (error) {
      console.error('Erro ao processar usuário:', error);
    }
  };

  // Login com Supabase
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!email || !senha) {
        toast.error('Por favor, preencha todos os campos');
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });
      
      if (error) {
        toast.error(error.message || 'Erro ao fazer login');
        return false;
      }
      
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Registro com Supabase
  const registrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!nome || !email || !senha) {
        toast.error('Por favor, preencha todos os campos');
        return false;
      }
      
      // Registrar usuário
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome
          }
        }
      });
      
      if (error) {
        toast.error(error.message || 'Erro ao criar conta');
        return false;
      }
      
      // Criar perfil do usuário
      if (data.user) {
        const { error: perfilError } = await supabase
          .from('perfis')
          .insert([{ id: data.user.id, nome, email }]);
        
        if (perfilError) {
          console.error('Erro ao criar perfil:', perfilError);
          // Não vamos falhar o registro apenas porque o perfil não foi criado
          // O perfil pode ser criado mais tarde
        }
      }
      
      toast.success('Conta criada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro ao criar conta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout com Supabase
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
        toast.error('Erro ao fazer logout');
        return;
      }
      
      setUser(null);
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      registrar, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
