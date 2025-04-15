
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const Auth = () => {
  const { login, registrar, isAuthenticated } = useAuth();
  
  // Estados para Login
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  
  // Estados para Registro
  const [nome, setNome] = useState('');
  const [emailRegistro, setEmailRegistro] = useState('');
  const [senhaRegistro, setSenhaRegistro] = useState('');
  const [loadingRegistro, setLoadingRegistro] = useState(false);

  // Se já está autenticado, redireciona para a home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Função para login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      await login(emailLogin, senhaLogin);
    } finally {
      setLoadingLogin(false);
    }
  };

  // Função para registro
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRegistro(true);
    try {
      await registrar(nome, emailRegistro, senhaRegistro);
    } finally {
      setLoadingRegistro(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-estudo-text">MedStudy</h1>
          <p className="text-estudo-gray mt-2">Sua plataforma de estudos médicos</p>
        </div>
        
        <Card className="shadow-apple rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">Bem-vindo(a)</CardTitle>
            <CardDescription className="text-center">
              Entre ou crie sua conta para acessar seus estudos
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 p-1 mx-4 mt-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="registro">Criar Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-6 pt-2">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={emailLogin}
                      onChange={(e) => setEmailLogin(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="******"
                      value={senhaLogin}
                      onChange={(e) => setSenhaLogin(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-estudo-primary hover:bg-estudo-secondary"
                      disabled={loadingLogin}
                    >
                      {loadingLogin ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-estudo-gray">
                    <p>Credenciais de teste:</p>
                    <p>Email: usuario@example.com</p>
                    <p>Senha: 123456</p>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="registro" className="p-6 pt-2">
                <form onSubmit={handleRegistro} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Seu nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-registro">E-mail</Label>
                    <Input
                      id="email-registro"
                      type="email"
                      placeholder="seu@email.com"
                      value={emailRegistro}
                      onChange={(e) => setEmailRegistro(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha-registro">Senha</Label>
                    <Input
                      id="senha-registro"
                      type="password"
                      placeholder="******"
                      value={senhaRegistro}
                      onChange={(e) => setSenhaRegistro(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-estudo-primary hover:bg-estudo-secondary"
                      disabled={loadingRegistro}
                    >
                      {loadingRegistro ? 'Criando conta...' : 'Criar conta'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
