
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TemaEstudo } from '@/types/estudos';
import { useAuth } from '@/contexts/AuthContext';
import { categoriasIniciais } from '@/data/categoriasIniciais';
import { useRevisoes } from '@/hooks/useRevisoes';
import { useFiltrosTemas } from '@/hooks/useFiltrosTemas';
import { useTemaOperations } from '@/hooks/useTemaOperations';
import { EstudosContextType } from './types/EstudosContextTypes';

const EstudosContext = createContext<EstudosContextType | undefined>(undefined);

export const EstudosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [temas, setTemas] = useState<TemaEstudo[]>([]);
  const [categorias] = useState(categoriasIniciais);
  
  // Use custom hooks
  const { 
    categoriaAtual, 
    prioridadeAtual, 
    nivelAprendizadoAtual, 
    temasFiltrados,
    filtrarPorCategoria,
    filtrarPorPrioridade,
    filtrarPorNivelAprendizado,
    resetarFiltros
  } = useFiltrosTemas(temas);
  
  const {
    isLoading,
    marcarConcluido,
    marcarRevisaoConcluida,
    atualizarNivelAprendizado,
    carregarTemas,
    adicionarTema
  } = useTemaOperations(temas, setTemas, user);
  
  const {
    obterRevisoesAtrasadas,
    obterRevisoesHoje,
    contarRevisoesPendentes
  } = useRevisoes(temas);

  // Carregar temas quando o componente montar ou o usuário mudar
  useEffect(() => {
    if (user) {
      carregarTemas();
    }
  }, [user]);

  return (
    <EstudosContext.Provider value={{
      temas,
      categorias,
      marcarConcluido,
      marcarRevisaoConcluida,
      adicionarTema,
      filtrarPorCategoria,
      filtrarPorPrioridade,
      filtrarPorNivelAprendizado,
      resetarFiltros,
      categoriaAtual,
      prioridadeAtual,
      nivelAprendizadoAtual,
      temasFiltrados,
      obterRevisoesHoje,
      obterRevisoesAtrasadas,
      atualizarNivelAprendizado,
      carregarTemas,
      contarRevisoesPendentes
    }}>
      {children}
    </EstudosContext.Provider>
  );
};

export const useEstudos = () => {
  const context = useContext(EstudosContext);
  if (context === undefined) {
    throw new Error('useEstudos deve ser usado dentro de um EstudosProvider');
  }
  return context;
};
