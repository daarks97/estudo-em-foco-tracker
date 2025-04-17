
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TemaEstudo, Categoria, Revisao } from '@/types/estudos';
import { addDays, isSameDay, isAfter, isBefore } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Dados iniciais para demonstração
const categoriasIniciais: Categoria[] = [
  { id: '1', nome: 'Clínica Médica', emoji: '🩺' },
  { id: '2', nome: 'Cirurgia', emoji: '🔪' },
  { id: '3', nome: 'Pediatria', emoji: '🧒🏼' },
  { id: '4', nome: 'Ginecologia e Obstetrícia', emoji: '🤰🏼' },
  { id: '5', nome: 'Medicina Preventiva', emoji: '🌎' },
  { id: '6', nome: 'Psiquiatria', emoji: '🧠' },
  { id: '7', nome: 'Ética Médica / Medicina Legal', emoji: '⚖️' },
  { id: '8', nome: 'Infectologia', emoji: '🦠' },
  { id: '9', nome: 'Neurologia', emoji: '🧬' },
  { id: '10', nome: 'Dermatologia', emoji: '🧴' },
  { id: '11', nome: 'Ortopedia', emoji: '🦴' },
  { id: '12', nome: 'Urologia', emoji: '💦' },
  { id: '13', nome: 'Geriatria', emoji: '👵🏻' },
  { id: '14', nome: 'Cardiologia', emoji: '❤️' },
  { id: '15', nome: 'Pneumologia', emoji: '🌬️' },
  { id: '16', nome: 'Gastroenterologia', emoji: '🧃' },
  { id: '17', nome: 'Nefrologia', emoji: '💧' },
  { id: '18', nome: 'Reumatologia', emoji: '💢' },
  { id: '19', nome: 'Endocrinologia', emoji: '🍩' },
  { id: '20', nome: 'Hematologia', emoji: '🩸' },
  { id: '21', nome: 'Medicina da Família e Comunidade', emoji: '🏡' },
  { id: '22', nome: 'Medicina Intensiva', emoji: '🚨' },
  { id: '23', nome: 'Medicina de Urgência e Emergência', emoji: '🆘' },
  { id: '24', nome: 'Saúde da Mulher', emoji: '🚺' },
  { id: '25', nome: 'Saúde da Criança e do Adolescente', emoji: '👶🏻' },
];

// Função para gerar revisões para um tema
const gerarRevisoes = (tema: Omit<TemaEstudo, 'id' | 'revisoes'>): Revisao[] => {
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

// Gerando temas iniciais com datas relativas a hoje
const hoje = new Date();
const temasIniciais: TemaEstudo[] = [];

interface EstudosContextType {
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

const EstudosContext = createContext<EstudosContextType | undefined>(undefined);

export const EstudosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [temas, setTemas] = useState<TemaEstudo[]>(temasIniciais);
  const [categorias] = useState<Categoria[]>(categoriasIniciais);
  const [categoriaAtual, setCategoriaAtual] = useState<string | null>(null);
  const [prioridadeAtual, setPrioridadeAtual] = useState<'baixa' | 'media' | 'alta' | null>(null);
  const [nivelAprendizadoAtual, setNivelAprendizadoAtual] = useState<'iniciado' | 'reforcando' | 'dominado' | null>(null);
  const [temasFiltrados, setTemasFiltrados] = useState<TemaEstudo[]>(temas);
  const [isLoading, setIsLoading] = useState(false);

  const carregarTemas = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('temas')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Erro ao carregar temas:', error);
        toast.error('Erro ao carregar temas');
        return;
      }
      
      if (data) {
        // Transformar os dados do formato do Supabase para o formato usado pelo app
        const temasCarregados: TemaEstudo[] = data.map(tema => {
          // Gerar revisões para o tema
          const novasRevisoes = gerarRevisoes({
            titulo: tema.titulo,
            categoria: tema.categoria,
            dataEstudo: new Date(tema.data_estudo),
            dataLimite: tema.data_limite ? new Date(tema.data_limite) : null,
            concluido: tema.concluido,
            dataConclusao: tema.data_conclusao ? new Date(tema.data_conclusao) : null,
            prioridade: tema.prioridade as 'baixa' | 'media' | 'alta',
          });
          
          // Atualizar o temaId para as revisões
          novasRevisoes.forEach(revisao => {
            revisao.temaId = tema.id;
          });
          
          return {
            id: tema.id,
            titulo: tema.titulo,
            categoria: tema.categoria,
            dataEstudo: new Date(tema.data_estudo),
            dataLimite: tema.data_limite ? new Date(tema.data_limite) : null,
            concluido: tema.concluido,
            dataConclusao: tema.data_conclusao ? new Date(tema.data_conclusao) : null,
            prioridade: tema.prioridade as 'baixa' | 'media' | 'alta',
            nivelAprendizado: tema.nivel_aprendizado as 'iniciado' | 'reforcando' | 'dominado' | undefined,
            revisoes: novasRevisoes
          };
        });
        
        setTemas(temasCarregados);
      }
    } catch (error) {
      console.error('Erro ao carregar temas:', error);
      toast.error('Erro ao carregar temas');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar temas quando o componente montar ou o usuário mudar
  useEffect(() => {
    if (user) {
      carregarTemas();
    }
  }, [user]);

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

  const marcarConcluido = async (id: string, concluido: boolean) => {
    if (!user) return;
    
    const dataConclusao = concluido ? new Date() : null;
    
    try {
      // Atualizar no Supabase
      const { error } = await supabase
        .from('temas')
        .update({ 
          concluido: concluido,
          data_conclusao: dataConclusao
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Erro ao atualizar tema:', error);
        toast.error('Erro ao atualizar tema');
        return;
      }
      
      // Atualizar estado local
      setTemas(prevTemas => prevTemas.map(tema => {
        if (tema.id === id) {
          return {
            ...tema,
            concluido,
            dataConclusao
          };
        }
        return tema;
      }));
      
      toast.success(concluido ? "Tema marcado como concluído!" : "Tema marcado como não concluído!");
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      toast.error('Erro ao atualizar tema');
    }
  };
  
  const marcarRevisaoConcluida = (temaId: string, revisaoId: string, concluida: boolean, status?: 'sucesso' | 'incompleta') => {
    setTemas(prevTemas => prevTemas.map(tema => {
      if (tema.id === temaId) {
        const novasRevisoes = tema.revisoes.map(revisao => {
          if (revisao.id === revisaoId) {
            return {
              ...revisao,
              concluida,
              dataConclusao: concluida ? new Date() : null,
              statusRevisao: concluida ? status || 'sucesso' : null
            };
          }
          return revisao;
        });
        
        return {
          ...tema,
          revisoes: novasRevisoes
        };
      }
      return tema;
    }));
    
    if (concluida) {
      const mensagem = status === 'incompleta' 
        ? "Revisão marcada como incompleta" 
        : "Revisão concluída com sucesso!";
      
      toast.success(mensagem);
    } else {
      toast.success("Revisão marcada como não concluída");
    }
  };

  const atualizarNivelAprendizado = async (temaId: string, nivel: 'iniciado' | 'reforcando' | 'dominado') => {
    if (!user) return;
    
    try {
      // Atualizar no Supabase
      const { error } = await supabase
        .from('temas')
        .update({ nivel_aprendizado: nivel })
        .eq('id', temaId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Erro ao atualizar nível de aprendizado:', error);
        toast.error('Erro ao atualizar nível de aprendizado');
        return;
      }
      
      // Atualizar estado local
      setTemas(prevTemas => prevTemas.map(tema => {
        if (tema.id === temaId) {
          return {
            ...tema,
            nivelAprendizado: nivel
          };
        }
        return tema;
      }));
      
      toast.success(`Nível de aprendizado atualizado para: ${nivel}`);
    } catch (error) {
      console.error('Erro ao atualizar nível de aprendizado:', error);
      toast.error('Erro ao atualizar nível de aprendizado');
    }
  };

  const adicionarTema = async (tema: Omit<TemaEstudo, 'id' | 'revisoes'>) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    try {
      // Preparar o tema para inserção no Supabase
      const temaParaInserir = {
        titulo: tema.titulo,
        categoria: tema.categoria,
        data_estudo: tema.dataEstudo.toISOString(),
        data_limite: tema.dataLimite ? tema.dataLimite.toISOString() : null,
        concluido: tema.concluido,
        data_conclusao: tema.dataConclusao ? tema.dataConclusao.toISOString() : null,
        prioridade: tema.prioridade,
        user_id: user.id
      };
      
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('temas')
        .insert([temaParaInserir])
        .select();
        
      if (error) {
        console.error('Erro ao adicionar tema:', error);
        toast.error('Erro ao adicionar tema');
        return;
      }
      
      if (data && data.length > 0) {
        const temaInserido = data[0];
        const id = temaInserido.id;
        
        // Gerar revisões para o tema
        const novasRevisoes = gerarRevisoes(tema);
        
        // Atualizar o temaId para as revisões
        novasRevisoes.forEach(revisao => {
          revisao.temaId = id;
        });
        
        const novoTema: TemaEstudo = {
          ...tema,
          id,
          revisoes: novasRevisoes
        };
        
        // Atualizar o estado local
        setTemas(prevTemas => [...prevTemas, novoTema]);
        toast.success("Novo tema adicionado com sucesso!");
      }
    } catch (error) {
      console.error('Erro ao adicionar tema:', error);
      toast.error('Erro ao adicionar tema');
    }
  };
  
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
              statusRevisao: revisao.statusRevisao
            });
          }
        }
      });
    });
    
    return resultados;
  };

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
      carregarTemas
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
