import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, ArrowRight, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import * as pdfjs from 'pdfjs-dist';

// Inicializando PDF.js worker
const pdfjsWorker = '//cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFUploader = ({ onSalvarFlashcards }) => {
  const { user } = useAuth();
  const [arquivo, setArquivo] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [processando, setProcessando] = useState(false);
  const [flashcardsGerados, setFlashcardsGerados] = useState([]);
  const [textoExtraido, setTextoExtraido] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são aceitos.');
      return;
    }

    setArquivo(file);
    setNomeArquivo(file.name);
    setFlashcardsGerados([]);
  };

  const limparArquivo = () => {
    setArquivo(null);
    setNomeArquivo('');
    setTextoExtraido('');
    setFlashcardsGerados([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extrairTextoDoPDF = async (file) => {
    try {
      const fileReader = new FileReader();
      
      return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
          try {
            // Ensure we're handling the result as an ArrayBuffer
            const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
            const pdf = await pdfjs.getDocument(typedArray).promise;
            
            let fullText = '';
            
            // Extrair texto de cada página
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const textItems = textContent.items
                .filter(item => 'str' in item) // Filter only TextItems that have the 'str' property
                .map(item => (item as pdfjs.TextItem).str); // Explicitly cast to TextItem
              fullText += textItems.join(' ') + '\n';
            }
            
            resolve(fullText);
          } catch (error) {
            reject(error);
          }
        };
        
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
      throw new Error('Não foi possível extrair o texto do PDF.');
    }
  };

  const processarPDF = async () => {
    if (!arquivo) {
      toast.error('Selecione um arquivo PDF primeiro.');
      return;
    }

    try {
      setProcessando(true);
      
      // Extrair texto do PDF
      const textoExtraido = await extrairTextoDoPDF(arquivo);
      setTextoExtraido(textoExtraido as string);
      
      if (!textoExtraido || (typeof textoExtraido === 'string' && textoExtraido.trim().length < 50)) {
        toast.error('Não foi possível extrair texto suficiente do PDF.');
        return;
      }

      // Chamar a função de Edge Function para gerar flashcards
      const { data, error } = await supabase.functions.invoke('gerar-flashcards', {
        body: {
          texto: textoExtraido,
          origem: 'pdf',
          nomeArquivo: nomeArquivo
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
      console.error('Erro ao processar PDF:', error);
      toast.error('Erro ao processar o PDF. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const handleSalvarFlashcards = async () => {
    if (!flashcardsGerados.length) {
      toast.error('Nenhum flashcard para salvar.');
      return;
    }

    const salvo = await onSalvarFlashcards(flashcardsGerados, 'pdf', nomeArquivo);
    if (salvo) {
      limparArquivo();
    }
  };

  return (
    <div>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Como funciona</AlertTitle>
        <AlertDescription>
          Faça o upload de um arquivo PDF com seu resumo de estudos. 
          Nossa IA irá extrair o texto e gerar automaticamente flashcards para você revisar.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardContent className="p-6">
          {!arquivo ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Clique para selecionar um PDF</p>
              <p className="text-sm text-gray-500 text-center">
                Ou arraste e solte seu arquivo aqui
              </p>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium">{nomeArquivo}</p>
                    <p className="text-sm text-gray-500">
                      {arquivo.size ? `${(arquivo.size / 1024 / 1024).toFixed(2)} MB` : ''}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={limparArquivo}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button variant="outline" onClick={limparArquivo}>
                  Cancelar
                </Button>
                <Button 
                  onClick={processarPDF} 
                  disabled={processando}
                >
                  {processando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Processar PDF
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

export default PDFUploader;
