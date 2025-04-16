
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Google API configuration
const API_KEY = 'AIzaSyCZTmIGT4Z5qnvrHkYjI6IgK1V-KCFzDok'; 
const CLIENT_ID = '380175101248-9t5i83lhijj3icns8c19oqvjrp83qlvg.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export interface GoogleDocument {
  id: string;
  name: string;
}

export function useGoogleDocs() {
  const [gapi, setGapi] = useState<any>(null);
  const [googleAuth, setGoogleAuth] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [documento, setDocumento] = useState<GoogleDocument | null>(null);

  useEffect(() => {
    // Load the Google API
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
      setIsLoading(false);
    }).catch(error => {
      console.error('Erro ao inicializar a API do Google:', error);
      toast.error('Não foi possível conectar com a API do Google.');
      setIsLoading(false);
    });
  };

  const updateSigninStatus = (isSignedIn: boolean) => {
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
        setDocumento(null);
      }).catch(error => {
        console.error('Erro ao fazer logout do Google:', error);
      });
    }
  };

  const selecionarArquivo = async () => {
    try {
      if (!window.google) {
        // Load Google Picker API
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js?onload=onApiLoad';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        window.onApiLoad = () => {
          window.gapi.load('picker', { callback: () => openPicker() });
        };
      } else {
        openPicker();
      }
    } catch (error) {
      console.error('Erro ao abrir o seletor de arquivos do Google Drive:', error);
      toast.error('Não foi possível abrir o seletor de arquivos.');
    }
  };

  const openPicker = () => {
    const picker = new window.google.picker.PickerBuilder()
      .addView(new window.google.picker.DocsView())
      .setOAuthToken(googleAuth.currentUser.get().getAuthResponse().access_token)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = async (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const doc = data.docs[0];
      setDocumento({
        id: doc.id,
        name: doc.name
      });
    }
  };

  const extrairTextoDoDocumento = async (docId: string): Promise<string> => {
    try {
      const response = await window.gapi.client.drive.files.export({
        fileId: docId,
        mimeType: 'text/plain'
      });
      
      return response.body;
    } catch (error) {
      console.error('Erro ao extrair texto do documento:', error);
      throw new Error('Não foi possível extrair o texto do documento.');
    }
  };

  return {
    isLoggedIn,
    isLoading,
    documento,
    handleLogin,
    handleLogout,
    selecionarArquivo,
    extrairTextoDoDocumento,
    setDocumento
  };
}
