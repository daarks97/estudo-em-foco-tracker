
import { useState } from 'react';
import { TemaEstudo, Revisao } from '@/types/estudos';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { gerarRevisoes, gerarProximaRevisao } from '@/utils/revisaoUtils';

export const useTemaOperations = (
  temas: TemaEstudo[], 
  setTemas: React.Dispatch<React.SetStateAction<TemaEstudo[]>>, 
  user: { id: string } | null
) => {
  const [isLoading, setIsLoading] = useState(false);

  const marcarConcluido = async (id: string, concluido: boolean) => {
    if (!user) return;
    
    const dataConclusao = concluido ? new Date().toISOString() : null;
    
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
          // Se estiver sendo marcado como concluído, gerar revisão inicial
          let novasRevisoes = [...tema.revisoes];
          
          if (concluido && novasRevisoes.length === 0) {
            // Só gera revisão se não tiver nenhuma ainda
            const revisaoInicial = gerarRevisoes({
              titulo: tema.titulo,
              categoria: tema.categoria,
              dataEstudo: tema.dataEstudo,
              dataLimite: tema.dataLimite,
              concluido: true,
              dataConclusao: dataConclusao ? new Date(dataConclusao) : new Date(),
              prioridade: tema.prioridade
            })[0];
            
            if (revisaoInicial) {
              revisaoInicial.temaId = id;
              novasRevisoes.push(revisaoInicial);
            }
          }
          
          return {
            ...tema,
            concluido,
            dataConclusao: dataConclusao ? new Date(dataConclusao) : null,
            revisoes: novasRevisoes
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
        // Encontrar a revisão atual
        const revisaoAtual = tema.revisoes.find(rev => rev.id === revisaoId);
        
        if (!revisaoAtual) return tema;
        
        // Atualizar as revisões existentes
        let novasRevisoes = tema.revisoes.map(revisao => {
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
        
        // Se a revisão foi marcada como concluída, gerar a próxima revisão
        if (concluida && revisaoAtual && (status === 'sucesso' || !status)) {
          const revisaoAtualAtualizada = {
            ...revisaoAtual,
            concluida: true,
            dataConclusao: new Date(),
            statusRevisao: status || 'sucesso'
          };
          
          const proximaRevisao = gerarProximaRevisao(revisaoAtualAtualizada);
          
          if (proximaRevisao) {
            proximaRevisao.temaId = temaId;
            novasRevisoes.push(proximaRevisao);
          }
        }
        
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
          // Verificar se o tema está concluído para gerar revisões
          const novasRevisoes: Revisao[] = [];
          
          if (tema.concluido) {
            // Gerar apenas a primeira revisão para temas concluídos que ainda não têm revisão
            const revisaoInicial = gerarRevisoes({
              titulo: tema.titulo,
              categoria: tema.categoria,
              dataEstudo: new Date(tema.data_estudo),
              dataLimite: tema.data_limite ? new Date(tema.data_limite) : null,
              concluido: tema.concluido,
              dataConclusao: tema.data_conclusao ? new Date(tema.data_conclusao) : null,
              prioridade: tema.prioridade as 'baixa' | 'media' | 'alta',
            })[0];
            
            if (revisaoInicial) {
              revisaoInicial.temaId = tema.id;
              novasRevisoes.push(revisaoInicial);
            }
          }
          
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
        
        // Verificar se o tema já está concluído para gerar revisões
        let novasRevisoes: Revisao[] = [];
        
        if (tema.concluido) {
          // Gerar apenas a primeira revisão para temas que já estão concluídos
          const revisaoInicial = gerarRevisoes(tema)[0];
          
          if (revisaoInicial) {
            revisaoInicial.temaId = id;
            novasRevisoes.push(revisaoInicial);
          }
        }
        
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

  return {
    isLoading,
    marcarConcluido,
    marcarRevisaoConcluida,
    atualizarNivelAprendizado,
    carregarTemas,
    adicionarTema
  };
};
