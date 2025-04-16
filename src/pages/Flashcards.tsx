
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, FileText, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import PDFUploader from '@/components/flashcards/PDFUploader';
import GoogleDocsImporter from '@/components/flashcards/GoogleDocsImporter';
import FlashcardsList from '@/components/flashcards/FlashcardsList';
import { supabase } from '@/lib/supabase';

const Flashcards = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('meus-flashcards');
  const [meuFlashcards, setMeusFlashcards] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (user) {
      carregarFlashcards();
    }
  }, [user]);

  const carregarFlashcards = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) {
        throw error;
      }

      setMeusFlashcards(data || []);
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error);
      toast.error('Não foi possível carregar seus flashcards.');
    } finally {
      setCarregando(false);
    }
  };

  const salvarFlashcards = async (flashcards, origem, nomeArquivo) => {
    try {
      if (!user) {
        toast.error('Você precisa estar logado para salvar flashcards.');
        return false;
      }

      const novoFlashcards = flashcards.map(card => ({
        user_id: user.id,
        pergunta: card.pergunta,
        resposta: card.resposta,
        origem,
        nome_arquivo: nomeArquivo,
      }));

      const { error } = await supabase
        .from('flashcards')
        .insert(novoFlashcards);

      if (error) {
        throw error;
      }

      toast.success('Flashcards salvos com sucesso!');
      carregarFlashcards();
      setActiveTab('meus-flashcards');
      return true;
    } catch (error) {
      console.error('Erro ao salvar flashcards:', error);
      toast.error('Erro ao salvar flashcards. Tente novamente.');
      return false;
    }
  };

  const marcarComoRevisado = async (id, revisado) => {
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
      
      carregarFlashcards();
    } catch (error) {
      console.error('Erro ao atualizar status do flashcard:', error);
      toast.error('Não foi possível atualizar o status do flashcard.');
    }
  };

  const excluirFlashcard = async (id) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Flashcard excluído com sucesso!');
      carregarFlashcards();
    } catch (error) {
      console.error('Erro ao excluir flashcard:', error);
      toast.error('Não foi possível excluir o flashcard.');
    }
  };

  return (
    <div className="min-h-screen bg-estudo-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-estudo-text">Flashcards</h1>
        </div>
        
        <div className="mb-6 bg-white rounded-lg p-6 shadow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-estudo-text">Estude com Flashcards</h2>
              <p className="text-sm text-estudo-gray mt-1">
                Gere flashcards automaticamente a partir dos seus resumos
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setActiveTab('importar-google')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar do Google Docs
              </Button>
              
              <Button 
                onClick={() => setActiveTab('importar-pdf')}
                className="bg-estudo-primary hover:bg-estudo-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Enviar PDF
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="meus-flashcards">Meus Flashcards</TabsTrigger>
            <TabsTrigger value="importar-google">Google Docs</TabsTrigger>
            <TabsTrigger value="importar-pdf">PDF</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meus-flashcards">
            {carregando ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-estudo-primary" />
              </div>
            ) : meuFlashcards.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhum flashcard encontrado</AlertTitle>
                <AlertDescription>
                  Você ainda não tem flashcards. Importe um documento do Google Drive ou faça upload de um PDF para gerar flashcards.
                </AlertDescription>
              </Alert>
            ) : (
              <FlashcardsList 
                flashcards={meuFlashcards} 
                onMarcarRevisado={marcarComoRevisado}
                onExcluir={excluirFlashcard}
              />
            )}
          </TabsContent>
          
          <TabsContent value="importar-google">
            <GoogleDocsImporter onSalvarFlashcards={salvarFlashcards} />
          </TabsContent>
          
          <TabsContent value="importar-pdf">
            <PDFUploader onSalvarFlashcards={salvarFlashcards} />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-estudo-primary py-4 text-center text-white text-sm">
        Estudo em Foco - Seu assistente para preparação de residência
      </footer>
    </div>
  );
};

export default Flashcards;
