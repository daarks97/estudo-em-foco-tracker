
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TemaEstudo, Categoria } from '@/types/estudos';

// Dados iniciais para demonstração
const categoriasIniciais: Categoria[] = [
  { id: '1', nome: 'Clínica Médica' },
  { id: '2', nome: 'Cirurgia' },
  { id: '3', nome: 'Pediatria' },
  { id: '4', nome: 'Ginecologia e Obstetrícia' },
  { id: '5', nome: 'Medicina Preventiva' },
];

const temasIniciais: TemaEstudo[] = [
  {
    id: '1',
    titulo: 'Hipertensão Arterial',
    categoria: '1',
    dataLimite: new Date(2025, 4, 30),
    concluido: false,
    dataConclusao: null,
    prioridade: 'alta',
  },
  {
    id: '2',
    titulo: 'Diabetes Mellitus',
    categoria: '1',
    dataLimite: new Date(2025, 4, 25),
    concluido: true,
    dataConclusao: new Date(2025, 4, 20),
    prioridade: 'alta',
  },
  {
    id: '3',
    titulo: 'Apendicite Aguda',
    categoria: '2',
    dataLimite: new Date(2025, 5, 15),
    concluido: false,
    dataConclusao: null,
    prioridade: 'media',
  },
  {
    id: '4',
    titulo: 'Cuidados pré-natais',
    categoria: '4',
    dataLimite: new Date(2025, 5, 5),
    concluido: false,
    dataConclusao: null,
    prioridade: 'media',
  },
  {
    id: '5',
    titulo: 'Vacinação Infantil',
    categoria: '3',
    dataLimite: new Date(2025, 5, 20),
    concluido: false,
    dataConclusao: null,
    prioridade: 'baixa',
  },
  {
    id: '6',
    titulo: 'Epidemiologia',
    categoria: '5',
    dataLimite: new Date(2025, 4, 10),
    concluido: false,
    dataConclusao: null,
    prioridade: 'alta',
  },
];

interface EstudosContextType {
  temas: TemaEstudo[];
  categorias: Categoria[];
  marcarConcluido: (id: string, concluido: boolean) => void;
  adicionarTema: (tema: Omit<TemaEstudo, 'id'>) => void;
  filtrarPorCategoria: (categoriaId: string | null) => void;
  categoriaAtual: string | null;
  temasFiltrados: TemaEstudo[];
}

const EstudosContext = createContext<EstudosContextType | undefined>(undefined);

export const EstudosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [temas, setTemas] = useState<TemaEstudo[]>(temasIniciais);
  const [categorias] = useState<Categoria[]>(categoriasIniciais);
  const [categoriaAtual, setCategoriaAtual] = useState<string | null>(null);
  const [temasFiltrados, setTemasFiltrados] = useState<TemaEstudo[]>(temas);

  const filtrarPorCategoria = (categoriaId: string | null) => {
    setCategoriaAtual(categoriaId);
  };

  useEffect(() => {
    if (categoriaAtual) {
      setTemasFiltrados(temas.filter(tema => tema.categoria === categoriaAtual));
    } else {
      setTemasFiltrados(temas);
    }
  }, [categoriaAtual, temas]);

  const marcarConcluido = (id: string, concluido: boolean) => {
    setTemas(prevTemas => prevTemas.map(tema => {
      if (tema.id === id) {
        return {
          ...tema,
          concluido,
          dataConclusao: concluido ? new Date() : null
        };
      }
      return tema;
    }));
  };

  const adicionarTema = (tema: Omit<TemaEstudo, 'id'>) => {
    const novoTema: TemaEstudo = {
      ...tema,
      id: Date.now().toString()
    };
    setTemas(prevTemas => [...prevTemas, novoTema]);
  };

  return (
    <EstudosContext.Provider value={{
      temas,
      categorias,
      marcarConcluido,
      adicionarTema,
      filtrarPorCategoria,
      categoriaAtual,
      temasFiltrados
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
