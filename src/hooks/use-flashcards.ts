
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Flashcard {
  id: string;
  pergunta: string;
  resposta: string;
  origem: string;
  nome_arquivo?: string;
  data_criacao: string;
  revisado: boolean;
  data_revisao?: string;
  user_id: string;
}

export function useFlashcards(userId?: string) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) {
        throw error;
      }

      setFlashcards(data || []);
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error);
      toast.error('Não foi possível carregar seus flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const markAsReviewed = async (id: string, revisado: boolean) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
          revisado,
          data_revisao: revisado ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success(revisado 
        ? 'Flashcard marcado como revisado!' 
        : 'Flashcard marcado como não revisado!');
      
      await loadFlashcards();
    } catch (error) {
      console.error('Erro ao atualizar status do flashcard:', error);
      toast.error('Não foi possível atualizar o status do flashcard.');
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Flashcard excluído com sucesso!');
      await loadFlashcards();
    } catch (error) {
      console.error('Erro ao excluir flashcard:', error);
      toast.error('Não foi possível excluir o flashcard.');
    }
  };

  const saveFlashcards = async (flashcards: Omit<Flashcard, 'id' | 'data_criacao' | 'revisado' | 'data_revisao'>[], origem: string, nomeArquivo: string) => {
    try {
      if (!userId) {
        toast.error('Você precisa estar logado para salvar flashcards.');
        return false;
      }

      const newFlashcards = flashcards.map(card => ({
        user_id: userId,
        pergunta: card.pergunta,
        resposta: card.resposta,
        origem,
        nome_arquivo: nomeArquivo,
      }));

      const { error } = await supabase
        .from('flashcards')
        .insert(newFlashcards);

      if (error) {
        throw error;
      }

      toast.success('Flashcards salvos com sucesso!');
      await loadFlashcards();
      return true;
    } catch (error) {
      console.error('Erro ao salvar flashcards:', error);
      toast.error('Erro ao salvar flashcards. Tente novamente.');
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      loadFlashcards();
    }
  }, [userId]);

  return {
    flashcards,
    loading,
    loadFlashcards,
    markAsReviewed,
    deleteFlashcard,
    saveFlashcards
  };
}
