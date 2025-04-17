
import { Revisao } from '@/types/estudos';
import { addDays } from 'date-fns';

// Função para gerar revisões para um tema
export const gerarRevisoes = (tema: { 
  titulo: string;
  categoria: string;
  dataEstudo: Date;
  dataLimite: Date | null;
  concluido: boolean;
  dataConclusao: Date | null;
  prioridade: 'baixa' | 'media' | 'alta';
}): Revisao[] => {
  const dataEstudo = new Date(tema.dataEstudo);
  
  return [
    {
      id: `r1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      temaId: '',
      tipo: 'D1',
      dataRevisao: addDays(dataEstudo, 1),
      concluida: false,
      dataConclusao: null,
      statusRevisao: null
    },
    {
      id: `r7-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      temaId: '',
      tipo: 'D7',
      dataRevisao: addDays(dataEstudo, 7),
      concluida: false,
      dataConclusao: null,
      statusRevisao: null
    },
    {
      id: `r30-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      temaId: '',
      tipo: 'D30',
      dataRevisao: addDays(dataEstudo, 30),
      concluida: false,
      dataConclusao: null,
      statusRevisao: null
    }
  ];
};
