
import { Revisao } from '@/types/estudos';
import { addDays } from 'date-fns';

// Função para gerar a revisão inicial (D1) para um tema concluído
export const gerarRevisaoInicial = (tema: { 
  titulo: string;
  categoria: string;
  dataEstudo: Date;
  dataLimite: Date | null;
  concluido: boolean;
  dataConclusao: Date | null;
  prioridade: 'baixa' | 'media' | 'alta';
}): Revisao => {
  const dataBase = tema.dataConclusao || tema.dataEstudo;
  
  return {
    id: `r1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    temaId: '',
    tipo: 'D1',
    dataRevisao: addDays(dataBase, 1),
    concluida: false,
    dataConclusao: null,
    statusRevisao: null
  };
};

// Função para gerar a próxima revisão com base na revisão atual
export const gerarProximaRevisao = (revisaoAtual: Revisao): Revisao | null => {
  // Determinar qual o próximo tipo de revisão
  let proximoTipo: 'D7' | 'D30' | null = null;
  let diasAdicionar = 0;
  
  if (revisaoAtual.tipo === 'D1') {
    proximoTipo = 'D7';
    diasAdicionar = 7;
  } else if (revisaoAtual.tipo === 'D7') {
    proximoTipo = 'D30';
    diasAdicionar = 30;
  } else {
    // Se já é D30, não há próxima revisão
    return null;
  }
  
  // Base para a data da próxima revisão é a data de conclusão da revisão atual
  const dataBase = revisaoAtual.dataConclusao || new Date();
  
  return {
    id: `${proximoTipo.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    temaId: revisaoAtual.temaId,
    tipo: proximoTipo,
    dataRevisao: addDays(dataBase, diasAdicionar),
    concluida: false,
    dataConclusao: null,
    statusRevisao: null
  };
};

// Mantendo a função original para compatibilidade, mas ela só gerará a primeira revisão
export const gerarRevisoes = (tema: { 
  titulo: string;
  categoria: string;
  dataEstudo: Date;
  dataLimite: Date | null;
  concluido: boolean;
  dataConclusao: Date | null;
  prioridade: 'baixa' | 'media' | 'alta';
}): Revisao[] => {
  // Se o tema não estiver concluído, não geramos revisões
  if (!tema.concluido) {
    return [];
  }
  
  // Apenas geramos a primeira revisão (D1)
  const revisaoInicial = gerarRevisaoInicial(tema);
  return [revisaoInicial];
};
