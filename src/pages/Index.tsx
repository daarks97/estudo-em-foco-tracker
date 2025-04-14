
import React from 'react';
import { EstudosProvider } from '@/contexts/EstudosContext';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import CategoriasFiltro from '@/components/CategoriasFiltro';
import ListaTemas from '@/components/ListaTemas';

const Index = () => {
  return (
    <EstudosProvider>
      <div className="min-h-screen bg-estudo-background flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <Dashboard />
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <CategoriasFiltro />
            <ListaTemas />
          </div>
        </main>
        
        <footer className="bg-estudo-primary py-4 text-center text-white text-sm">
          Estudo em Foco - Seu assistente para preparação de residência
        </footer>
      </div>
    </EstudosProvider>
  );
};

export default Index;
