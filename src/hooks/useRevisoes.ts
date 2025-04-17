
import { useState } from 'react';
import { TemaEstudo } from '@/types/estudos';
import { isSameDay, isBefore } from 'date-fns';

export const useRevisoes = (temas: TemaEstudo[]) => {
  // Função para obter revisões atrasadas
  const obterRevisoesAtrasadas = () => {
    const hoje = new Date();
    const resultados: { 
      temaId: string; 
      titulo: string; 
      categoria: string; 
      revisaoId: string; 
      tipo: 'D1' | 'D7' | 'D30';
      statusRevisao?: 'sucesso' | 'incompleta' | null;
    }[] = [];
    
    temas.forEach(tema => {
      tema.revisoes.forEach(revisao => {
        if (!revisao.concluida) {
          const dataRevisao = new Date(revisao.dataRevisao);
          
          // Verificar se a revisão está atrasada
          if (isBefore(dataRevisao, hoje) && !isSameDay(dataRevisao, hoje)) {
            resultados.push({
              temaId: tema.id,
              titulo: tema.titulo,
              categoria: tema.categoria,
              revisaoId: revisao.id,
              tipo: revisao.tipo,
              statusRevisao: revisao.statusRevisao
            });
          }
        }
      });
    });
    
    return resultados;
  };

  // Função para obter revisões para hoje
  const obterRevisoesHoje = () => {
    const hoje = new Date();
    const resultados: { 
      temaId: string; 
      titulo: string; 
      categoria: string; 
      revisaoId: string; 
      tipo: 'D1' | 'D7' | 'D30';
      atrasada: boolean;
      statusRevisao?: 'sucesso' | 'incompleta' | null;
      dataRevisao: Date; // Adicionando a data da revisão para ordenação
    }[] = [];
    
    temas.forEach(tema => {
      tema.revisoes.forEach(revisao => {
        if (!revisao.concluida) {
          const dataRevisao = new Date(revisao.dataRevisao);
          
          // Verificar se a revisão é para hoje ou está atrasada
          if (isSameDay(dataRevisao, hoje) || isBefore(dataRevisao, hoje)) {
            resultados.push({
              temaId: tema.id,
              titulo: tema.titulo,
              categoria: tema.categoria,
              revisaoId: revisao.id,
              tipo: revisao.tipo,
              atrasada: isBefore(dataRevisao, hoje) && !isSameDay(dataRevisao, hoje),
              statusRevisao: revisao.statusRevisao,
              dataRevisao: dataRevisao
            });
          }
        }
      });
    });
    
    // Ordenar por data de revisão (mais antigas primeiro)
    resultados.sort((a, b) => a.dataRevisao.getTime() - b.dataRevisao.getTime());
    
    return resultados;
  };

  // Função para contar revisões pendentes por tipo
  const contarRevisoesPendentes = () => {
    const hoje = new Date();
    const contagem = {
      D1: 0,
      D7: 0,
      D30: 0,
      total: 0
    };
    
    temas.forEach(tema => {
      tema.revisoes.forEach(revisao => {
        if (!revisao.concluida) {
          contagem[revisao.tipo]++;
          contagem.total++;
        }
      });
    });
    
    return contagem;
  };

  return {
    obterRevisoesAtrasadas,
    obterRevisoesHoje,
    contarRevisoesPendentes
  };
};
