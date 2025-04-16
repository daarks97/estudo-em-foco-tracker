
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, ArrowRight } from 'lucide-react';
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
  const fileInputRef = useRef(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [textoExtraido, setTextoExtraido] = useState('');
  const [processando, setProcessando] = useState(false);
  const [flashcardsGerados, setFlashcardsGerados] = useState([]);

  const selecionarArquivo = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Por favor selecione um arquivo PDF.');
        return;
      }
      setArquivoSelecionado(file);
      setFlashcardsGerados([]);
    }
  };

  const handleCancelar = () => {
    setArquivoSelecionado(null);
    setTextoExtraido('');
    setFlashcardsGerados([]);
    fileInputRef.current.value = '';
  };

  const extrairTextoDoPDF = async (arquivo) => {
    if (arquivo) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(arquivo);
      
      return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
          try {
            // Ensure we're handling the result as an ArrayBuffer
            const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
            const pdf = await pdfjs.getDocument(typedArray).promise;
            
            let fullText = '';
            
            // Extrair texto de todas as páginas
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const textItems = textContent.items
                .filter(item => 'str' in item) // Filter only items that have the 'str' property
                .map(item => item.str); // Access str property directly
              fullText += textItems.join(' ') + '\n';
            }
            
            resolve(fullText);
          } catch (error) {
            console.error('Erro ao extrair texto do PDF:', error);
            reject(error);
          }
        };
        
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    }
  };

  const processarPDF = async () => {
    if (!arquivoSelecionado) {
      toast.error('Selecione um arquivo PDF primeiro.');
      return;
    }

    try {
      setProcessando(true);
      
      // Extrair texto do PDF
      const textoExtraido = await extrairTextoDoPDF(arquivoSelecionado);
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
          nomeArquivo: arquivoSelecionado.name
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

    const salvo = await onSalvarFlashcards(
      flashcardsGerados, 
      'pdf', 
      arquivoSelecionado?.name || 'Documento PDF'
    );
    
    if (salvo) {
      handleCancelar();
    }
  };

  return (
    <div>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Como funciona</AlertTitle>
        <AlertDescription>
          Faça upload de um arquivo PDF com seu resumo de estudos.
          Nossa IA irá extrair o texto e gerar automaticamente flashcards para você revisar.
        </AlertDescription>
      </Alert>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: 'none' }}
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          {!arquivoSelecionado ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Button 
                onClick={selecionarArquivo}
                className="bg-estudo-primary hover:bg-estudo-primary/90"
              >
                <Upload className="mr-2 h-4 w-4" />
                Selecionar arquivo PDF
              </Button>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Selecione um arquivo PDF com seu material de estudo.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium">{arquivoSelecionado.name}</p>
                    <p className="text-sm text-gray-500">
                      {(arquivoSelecionado.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={selecionarArquivo}
                >
                  Mudar
                </Button>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancelar}
                >
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
