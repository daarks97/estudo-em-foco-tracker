
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
      // Localizar o tema atual para preparar os dados para a revisão
      const temaAtual = temas.find(t => t.id === id);
      if (!temaAtual && concluido) {
        toast.error('Tema não encontrado');
        return;
      }
      
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
              
              // Salvar a revisão no banco de dados
              salvarRevisao(revisaoInicial).catch(err => {
                console.error('Erro ao salvar revisão:', err);
                toast.error('Erro ao criar revisão');
              });
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
      
      if (concluido) {
        toast.success("Revisão de 1 dia (D1) agendada para amanhã!");
      }
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      toast.error('Erro ao atualizar tema');
    }
  };
  
  // Função auxiliar para salvar a revisão no banco de dados
  const salvarRevisao = async (revisao: Revisao) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('revisoes')
        .insert([{
          id: revisao.id,
          tema_id: revisao.temaId,
          tipo: revisao.tipo,
          data_revisao: revisao.dataRevisao.toISOString(),
          concluida: revisao.concluida,
          data_conclusao: revisao.dataConclusao ? revisao.dataConclusao.toISOString() : null,
          status_revisao: revisao.statusRevisao,
          user_id: user.id
        }]);
        
      if (error) {
        console.error('Erro ao salvar revisão:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao salvar revisão:', error);
      throw error;
    }
  };
  
  const marcarRevisaoConcluida = async (temaId: string, revisaoId: string, concluida: boolean, status?: 'sucesso' | 'incompleta') => {
    if (!user) return;
    
    try {
      // Encontrar a revisão atual
      const tema = temas.find(t => t.id === temaId);
      if (!tema) {
        toast.error("Tema não encontrado");
        return;
      }
      
      const revisaoAtual = tema.revisoes.find(rev => rev.id === revisaoId);
      if (!revisaoAtual) {
        toast.error("Revisão não encontrada");
        return;
      }
      
      const dataConclusao = concluida ? new Date() : null;
      
      // Atualizar revisão no Supabase
      const { error } = await supabase
        .from('revisoes')
        .update({
          concluida: concluida,
          data_conclusao: dataConclusao ? dataConclusao.toISOString() : null,
          status_revisao: concluida ? status || 'sucesso' : null
        })
        .eq('id', revisaoId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Erro ao atualizar revisão:', error);
        toast.error('Erro ao atualizar revisão');
        return;
      }
      
      // Atualizar as revisões no estado local
      setTemas(prevTemas => prevTemas.map(tema => {
        if (tema.id === temaId) {
          // Atualizar as revisões existentes
          let novasRevisoes = tema.revisoes.map(revisao => {
            if (revisao.id === revisaoId) {
              return {
                ...revisao,
                concluida,
                dataConclusao,
                statusRevisao: concluida ? status || 'sucesso' : null
              };
            }
            return revisao;
          });
          
          // Se a revisão foi marcada como concluída com sucesso, gerar a próxima revisão
          if (concluida && (status === 'sucesso' || !status)) {
            const revisaoAtualAtualizada = {
              ...revisaoAtual,
              concluida: true,
              dataConclusao,
              statusRevisao: status || 'sucesso'
            };
            
            const proximaRevisao = gerarProximaRevisao(revisaoAtualAtualizada);
            
            if (proximaRevisao) {
              proximaRevisao.temaId = temaId;
              novasRevisoes.push(proximaRevisao);
              
              // Salvar a próxima revisão no banco de dados
              salvarRevisao(proximaRevisao).catch(err => {
                console.error('Erro ao salvar próxima revisão:', err);
                toast.error('Erro ao criar próxima revisão');
              });
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
        
        // Mostrar toast adicional sobre a próxima revisão se foi concluída com sucesso
        if (status !== 'incompleta' && revisaoAtual.tipo === 'D1') {
          toast.success("Revisão de 7 dias (D7) agendada!");
        } else if (status !== 'incompleta' && revisaoAtual.tipo === 'D7') {
          toast.success("Revisão de 30 dias (D30) agendada!");
        } else if (status !== 'incompleta' && revisaoAtual.tipo === 'D30') {
          toast.success("Ciclo de revisões concluído para este tema!");
        }
      } else {
        toast.success("Revisão marcada como não concluída");
      }
    } catch (error) {
      console.error('Erro ao atualizar revisão:', error);
      toast.error('Erro ao atualizar revisão');
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
      // Carregar temas
      const { data: dataTemas, error: errorTemas } = await supabase
        .from('temas')
        .select('*')
        .eq('user_id', user.id);
        
      if (errorTemas) {
        console.error('Erro ao carregar temas:', errorTemas);
        toast.error('Erro ao carregar temas');
        return;
      }
      
      // Carregar revisões
      const { data: dataRevisoes, error: errorRevisoes } = await supabase
        .from('revisoes')
        .select('*')
        .eq('user_id', user.id);
        
      if (errorRevisoes) {
        console.error('Erro ao carregar revisões:', errorRevisoes);
        toast.error('Erro ao carregar revisões');
        return;
      }
      
      // Agrupar revisões por tema
      const revisoesPorTema: Record<string, Revisao[]> = {};
      
      if (dataRevisoes) {
        dataRevisoes.forEach(revisao => {
          if (!revisoesPorTema[revisao.tema_id]) {
            revisoesPorTema[revisao.tema_id] = [];
          }
          
          revisoesPorTema[revisao.tema_id].push({
            id: revisao.id,
            temaId: revisao.tema_id,
            tipo: revisao.tipo,
            dataRevisao: new Date(revisao.data_revisao),
            concluida: revisao.concluida,
            dataConclusao: revisao.data_conclusao ? new Date(revisao.data_conclusao) : null,
            statusRevisao: revisao.status_revisao
          });
        });
      }
      
      if (dataTemas) {
        // Transformar os dados do formato do Supabase para o formato usado pelo app
        const temasCarregados: TemaEstudo[] = dataTemas.map(tema => {
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
            revisoes: revisoesPorTema[tema.id] || []
          };
        });
        
        // Verificar temas concluídos que ainda não têm revisões e criar a inicial
        for (const tema of temasCarregados) {
          if (tema.concluido && tema.revisoes.length === 0) {
            const revisaoInicial = gerarRevisoes({
              titulo: tema.titulo,
              categoria: tema.categoria,
              dataEstudo: tema.dataEstudo,
              dataLimite: tema.dataLimite,
              concluido: tema.concluido,
              dataConclusao: tema.dataConclusao,
              prioridade: tema.prioridade,
            })[0];
            
            if (revisaoInicial) {
              revisaoInicial.temaId = tema.id;
              tema.revisoes.push(revisaoInicial);
              
              // Salvar revisão no banco de dados
              await salvarRevisao(revisaoInicial).catch(err => {
                console.error('Erro ao salvar revisão inicial:', err);
              });
            }
          }
        }
        
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
