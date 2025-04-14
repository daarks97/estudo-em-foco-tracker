
export interface TemaEstudo {
  id: string;
  titulo: string;
  categoria: string;
  dataLimite: Date | null;
  concluido: boolean;
  dataConclusao: Date | null;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface Categoria {
  id: string;
  nome: string;
}
