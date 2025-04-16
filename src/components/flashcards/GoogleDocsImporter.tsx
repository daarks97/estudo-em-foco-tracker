
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useGoogleDocs } from '@/hooks/use-google-docs';
import GoogleLoginButton from './GoogleLoginButton';
import SelectedDocument from './SelectedDocument';
import FlashcardsPreview from './FlashcardsPreview';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

// Define Google API types for global window object
declare global {
  interface Window {
    gapi: any;
    google: any;
    onApiLoad: () => void;
  }
}

interface Flashcard {
  pergunta: string;
  resposta: string;
}

interface GoogleDocsImporterProps {
  onSalvarFlashcards: (
    flashcards: Flashcard[], 
    origem: string, 
    nomeArquivo: string
  ) => Promise<boolean>;
}

const GoogleDocsImporter: React.FC<GoogleDocsImporterProps> = ({ onSalvarFlashcards }) => {
  const { user } = useAuth();
  const [processando, setProcessando] = useState(false);
  const [flashcardsGerados, setFlashcardsGerados] = useState<Flashcard[]>([]);
  
  const { 
    isLoggedIn, 
    isLoading, 
    documento, 
    handleLogin, 
    handleLogout, 
    selecionarArquivo,
    extrairTextoDoDocumento,
    setDocumento
  } = useGoogleDocs();

  const processarDocumento = async () => {
    if (!documento) {
      toast.error('Selecione um documento primeiro.');
      return;
    }

    try {
      setProcessando(true);

      // Get document content
      const textoExtraido = await extrairTextoDoDocumento(documento.id);

      if (!textoExtraido || textoExtraido.trim().length < 50) {
        toast.error('Não foi possível extrair texto suficiente do documento.');
        return;
      }

      // Call Edge Function to generate flashcards
      const { data, error } = await supabase.functions.invoke('gerar-flashcards', {
        body: {
          texto: textoExtraido,
          origem: 'google_docs',
          nomeArquivo: documento.name
        }
      });

      if (error) {
        throw error;
      }

      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        throw new Error('Formato de resposta inválido da IA');
      }

      setFlashcardsGerados(data.flashcards);
      toast.success('Flashcards gerados com sucesso!');
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      toast.error('Erro ao processar o documento. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const handleSalvarFlashcards = async () => {
    if (!flashcardsGerados.length) {
      toast.error('Nenhum flashcard para salvar.');
      return;
    }

    const salvo = await onSalvarFlashcards(
      flashcardsGerados, 
      'google_docs', 
      documento?.name || 'Documento Google'
    );
    
    if (salvo) {
      setDocumento(null);
      setFlashcardsGerados([]);
    }
  };

  useEffect(() => {
    // Load Google Picker API when user is logged in
    if (isLoggedIn) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js?onload=onApiLoad';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      window.onApiLoad = () => {
        window.gapi.load('picker', { callback: () => {} });
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isLoggedIn]);

  return (
    <div>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Como funciona</AlertTitle>
        <AlertDescription>
          Importe um documento do Google Docs com seu resumo de estudos.
          Nossa IA irá extrair o texto e gerar automaticamente flashcards para você revisar.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-estudo-primary" />
              <span className="ml-3">Carregando API do Google...</span>
            </div>
          ) : !isLoggedIn ? (
            <div className="flex flex-col items-center justify-center p-8">
              <GoogleLoginButton onClick={handleLogin} />
              <p className="text-sm text-gray-500 mt-4 text-center">
                Faça login com sua conta Google para acessar seus documentos do Google Docs.
              </p>
            </div>
          ) : !documento ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Button 
                onClick={selecionarArquivo}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <FileText className="mr-2 h-4 w-4" />
                Selecionar documento do Google Docs
              </Button>
              <div className="mt-4 text-sm text-gray-500 text-center">
                <p>Selecione um documento do seu Google Drive.</p>
                <button 
                  onClick={handleLogout}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Mudar de conta
                </button>
              </div>
            </div>
          ) : (
            <SelectedDocument
              documento={documento}
              onMudar={() => setDocumento(null)}
              onCancelar={() => setDocumento(null)}
              onProcessar={processarDocumento}
              processando={processando}
            />
          )}
        </CardContent>
      </Card>

      {flashcardsGerados.length > 0 && (
        <FlashcardsPreview 
          flashcards={flashcardsGerados}
          onSalvar={handleSalvarFlashcards}
        />
      )}
    </div>
  );
};

export default GoogleDocsImporter;
