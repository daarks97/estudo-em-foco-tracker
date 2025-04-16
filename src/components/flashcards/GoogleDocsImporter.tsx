
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Configuração do Google API
const API_KEY = 'AIzaSyCZTmIGT4Z5qnvrHkYjI6IgK1V-KCFzDok'; // Esta chave deve ser movida para um .env ou Edge Function
const CLIENT_ID = '380175101248-9t5i83lhijj3icns8c19oqvjrp83qlvg.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

const GoogleDocsImporter = ({ onSalvarFlashcards }) => {
  const { user } = useAuth();
  const [gapi, setGapi] = useState(null);
  const [googleAuth, setGoogleAuth] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
  const [flashcardsGerados, setFlashcardsGerados] = useState([]);
  const [carregandoAPI, setCarregandoAPI] = useState(true);

  useEffect(() => {
    // Carregar a API do Google
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = initGoogleAPI;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initGoogleAPI = () => {
    window.gapi.load('client:auth2', initClient);
  };

  const initClient = () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      setGapi(window.gapi);
      setGoogleAuth(window.gapi.auth2.getAuthInstance());
      setIsLoggedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      setCarregandoAPI(false);
    }).catch(error => {
      console.error('Erro ao inicializar a API do Google:', error);
      toast.error('Não foi possível conectar com a API do Google.');
      setCarregandoAPI(false);
    });
  };

  const updateSigninStatus = (isSignedIn) => {
    setIsLoggedIn(isSignedIn);
  };

  const handleLogin = () => {
    if (googleAuth) {
      googleAuth.signIn().catch(error => {
        console.error('Erro ao fazer login com o Google:', error);
        toast.error('Erro ao fazer login com o Google.');
      });
    }
  };

  const handleLogout = () => {
    if (googleAuth) {
      googleAuth.signOut().then(() => {
        setDocumentoSelecionado(null);
        setFlashcardsGerados([]);
      }).catch(error => {
        console.error('Erro ao fazer logout do Google:', error);
      });
    }
  };

  const selecionarArquivo = async () => {
    try {
      const picker = new window.google.picker.PickerBuilder()
        .addView(new window.google.picker.DocsView())
        .setOAuthToken(googleAuth.currentUser.get().getAuthResponse().access_token)
        .setDeveloperKey(API_KEY)
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    } catch (error) {
      console.error('Erro ao abrir o seletor de arquivos do Google Drive:', error);
      toast.error('Não foi possível abrir o seletor de arquivos.');
    }
  };

  const pickerCallback = async (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const document = data.docs[0];
      setDocumentoSelecionado(document);
      setFlashcardsGerados([]);
    }
  };

  const processarDocumento = async () => {
    if (!documentoSelecionado) {
      toast.error('Selecione um documento primeiro.');
      return;
    }

    try {
      setProcessando(true);

      // Obter o conteúdo do documento
      const response = await gapi.client.drive.files.export({
        fileId: documentoSelecionado.id,
        mimeType: 'text/plain'
      });

      const textoExtraido = response.body;

      if (!textoExtraido || textoExtraido.trim().length < 50) {
        toast.error('Não foi possível extrair texto suficiente do documento.');
        return;
      }

      // Chamar a função de Edge Function para gerar flashcards
      const { data, error } = await supabase.functions.invoke('gerar-flashcards', {
        body: {
          texto: textoExtraido,
          origem: 'google_docs',
          nomeArquivo: documentoSelecionado.name
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
      documentoSelecionado?.name || 'Documento Google'
    );
    
    if (salvo) {
      setDocumentoSelecionado(null);
      setFlashcardsGerados([]);
    }
  };

  useEffect(() => {
    // Carregar a API do Google Picker
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
          {carregandoAPI ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-estudo-primary" />
              <span className="ml-3">Carregando API do Google...</span>
            </div>
          ) : !isLoggedIn ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Button 
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Fazer login com Google
              </Button>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Faça login com sua conta Google para acessar seus documentos do Google Docs.
              </p>
            </div>
          ) : !documentoSelecionado ? (
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
            <div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">{documentoSelecionado.name}</p>
                    <p className="text-sm text-gray-500">Google Docs</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setDocumentoSelecionado(null)}
                >
                  Mudar
                </Button>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDocumentoSelecionado(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={processarDocumento} 
                  disabled={processando}
                >
                  {processando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Processar Documento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {flashcardsGerados.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {flashcardsGerados.length} Flashcards Gerados
            </h3>
            <Button 
              onClick={handleSalvarFlashcards}
              className="bg-green-600 hover:bg-green-700"
            >
              Salvar Flashcards
            </Button>
          </div>
          
          <div className="space-y-4">
            {flashcardsGerados.map((card, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="font-medium">{card.pergunta}</p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                    <p>{card.resposta}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleDocsImporter;
