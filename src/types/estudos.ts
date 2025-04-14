
export interface TemaEstudo {
  id: string;
  titulo: string;
  categoria: string;
  dataEstudo: Date;
  dataLimite: Date | null;
  concluido: boolean;
  dataConclusao: Date | null;
  prioridade: 'baixa' | 'media' | 'alta';
  revisoes: Revisao[];
}

export interface Revisao {
  id: string;
  temaId: string;
  tipo: 'D1' | 'D7' | 'D30';
  dataRevisao: Date;
  concluida: boolean;
  dataConclusao: Date | null;
}

export interface Categoria {
  id: string;
  nome: string;
  emoji?: string;
}
