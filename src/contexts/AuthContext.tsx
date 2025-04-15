
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  nome: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Criando o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário mockado para simulação
const usuarioMock: User = {
  id: '1',
  email: 'usuario@example.com',
  nome: 'Usuário Teste'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulando verificação de autenticação no início
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Simulação de login
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação básica
      if (!email || !senha) {
        toast.error('Por favor, preencha todos os campos');
        return false;
      }
      
      // Em produção, isso seria uma chamada para um serviço de autenticação
      if (email === 'usuario@example.com' && senha === '123456') {
        setUser(usuarioMock);
        localStorage.setItem('authUser', JSON.stringify(usuarioMock));
        toast.success('Login realizado com sucesso!');
        return true;
      } else {
        toast.error('Credenciais inválidas');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      return false;
    }
  };

  // Simulação de registro
  const registrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação básica
      if (!nome || !email || !senha) {
        toast.error('Por favor, preencha todos os campos');
        return false;
      }
      
      // Em produção, isso seria uma chamada para um serviço de autenticação
      const novoUsuario = {
        id: Date.now().toString(),
        email,
        nome
      };
      
      setUser(novoUsuario);
      localStorage.setItem('authUser', JSON.stringify(novoUsuario));
      toast.success('Conta criada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao criar conta');
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    toast.success('Logout realizado com sucesso');
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
