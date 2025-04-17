
import { useState, useEffect } from 'react';
import { TemaEstudo } from '@/types/estudos';

export const useFiltrosTemas = (temas: TemaEstudo[]) => {
  const [categoriaAtual, setCategoriaAtual] = useState<string | null>(null);
  const [prioridadeAtual, setPrioridadeAtual] = useState<'baixa' | 'media' | 'alta' | null>(null);
  const [nivelAprendizadoAtual, setNivelAprendizadoAtual] = useState<'iniciado' | 'reforcando' | 'dominado' | null>(null);
  const [temasFiltrados, setTemasFiltrados] = useState<TemaEstudo[]>(temas);

  const filtrarPorCategoria = (categoriaId: string | null) => {
    setCategoriaAtual(categoriaId);
  };

  const filtrarPorPrioridade = (prioridade: 'baixa' | 'media' | 'alta' | null) => {
    setPrioridadeAtual(prioridade);
  };

  const filtrarPorNivelAprendizado = (nivel: 'iniciado' | 'reforcando' | 'dominado' | null) => {
    setNivelAprendizadoAtual(nivel);
  };

  const resetarFiltros = () => {
    setCategoriaAtual(null);
    setPrioridadeAtual(null);
    setNivelAprendizadoAtual(null);
  };

  useEffect(() => {
    let filtrados = [...temas];
    
    if (categoriaAtual) {
      filtrados = filtrados.filter(tema => tema.categoria === categoriaAtual);
    }
    
    if (prioridadeAtual) {
      filtrados = filtrados.filter(tema => tema.prioridade === prioridadeAtual);
    }
    
    if (nivelAprendizadoAtual) {
      filtrados = filtrados.filter(tema => tema.nivelAprendizado === nivelAprendizadoAtual);
    }
    
    setTemasFiltrados(filtrados);
  }, [categoriaAtual, prioridadeAtual, nivelAprendizadoAtual, temas]);

  return {
    categoriaAtual,
    prioridadeAtual,
    nivelAprendizadoAtual,
    temasFiltrados,
    filtrarPorCategoria,
    filtrarPorPrioridade,
    filtrarPorNivelAprendizado,
    resetarFiltros
  };
};
