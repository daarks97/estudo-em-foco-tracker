
import { TemaEstudo, Categoria, Revisao } from '@/types/estudos';

export interface EstudosContextType {
  temas: TemaEstudo[];
  categorias: Categoria[];
  marcarConcluido: (id: string, concluido: boolean) => void;
  marcarRevisaoConcluida: (temaId: string, revisaoId: string, concluida: boolean, status?: 'sucesso' | 'incompleta') => void;
  adicionarTema: (tema: Omit<TemaEstudo, 'id' | 'revisoes'>) => Promise<void>;
  filtrarPorCategoria: (categoriaId: string | null) => void;
  filtrarPorPrioridade: (prioridade: 'baixa' | 'media' | 'alta' | null) => void;
  filtrarPorNivelAprendizado: (nivel: 'iniciado' | 'reforcando' | 'dominado' | null) => void;
  resetarFiltros: () => void;
  categoriaAtual: string | null;
  prioridadeAtual: 'baixa' | 'media' | 'alta' | null;
  nivelAprendizadoAtual: 'iniciado' | 'reforcando' | 'dominado' | null;
  temasFiltrados: TemaEstudo[];
  obterRevisoesHoje: () => { 
    temaId: string; 
    titulo: string; 
    categoria: string; 
    revisaoId: string; 
    tipo: 'D1' | 'D7' | 'D30';
    atrasada: boolean; 
    statusRevisao?: 'sucesso' | 'incompleta' | null;
  }[];
  obterRevisoesAtrasadas: () => { 
    temaId: string; 
    titulo: string; 
    categoria: string; 
    revisaoId: string; 
    tipo: 'D1' | 'D7' | 'D30';
    statusRevisao?: 'sucesso' | 'incompleta' | null;
  }[];
  atualizarNivelAprendizado: (temaId: string, nivel: 'iniciado' | 'reforcando' | 'dominado') => void;
  carregarTemas: () => Promise<void>;
}
