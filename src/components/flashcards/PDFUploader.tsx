
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import PDFInfoAlert from './PDFInfoAlert';
import PDFFileSelector from './PDFFileSelector';
import FlashcardsPreview from './FlashcardsPreview';
import { extrairTextoDoPDF } from '@/utils/pdfExtractor';

interface Flashcard {
  pergunta: string;
  resposta: string;
}

interface PDFUploaderProps {
  onSalvarFlashcards: (flashcards: Flashcard[], origem: string, nomeArquivo: string) => Promise<boolean>;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onSalvarFlashcards }) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [textoExtraido, setTextoExtraido] = useState('');
  const [processando, setProcessando] = useState(false);
  const [flashcardsGerados, setFlashcardsGerados] = useState<Flashcard[]>([]);

  const handleFileChange = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Por favor selecione um arquivo PDF.');
      return;
    }
    setArquivoSelecionado(file);
    setFlashcardsGerados([]);
  };

  const handleCancelar = () => {
    setArquivoSelecionado(null);
    setTextoExtraido('');
    setFlashcardsGerados([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processarPDF = async () => {
    if (!arquivoSelecionado) {
      toast.error('Selecione um arquivo PDF primeiro.');
      return;
    }

    try {
      setProcessando(true);
      
      // Extract text from PDF
      const texto = await extrairTextoDoPDF(arquivoSelecionado);
      setTextoExtraido(texto);
      
      if (!texto || (typeof texto === 'string' && texto.trim().length < 50)) {
        toast.error('Não foi possível extrair texto suficiente do PDF.');
        return;
      }

      // Call Edge Function to generate flashcards
      const { data, error } = await supabase.functions.invoke('gerar-flashcards', {
        body: {
          texto: texto,
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
      <PDFInfoAlert />

      <PDFFileSelector 
        arquivoSelecionado={arquivoSelecionado}
        onFileChange={handleFileChange}
        onCancelar={handleCancelar}
        onProcessar={processarPDF}
        processando={processando}
      />

      {processando && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-estudo-primary" />
          <span className="ml-2">Processando PDF e gerando flashcards...</span>
        </div>
      )}

      {flashcardsGerados.length > 0 && (
        <FlashcardsPreview 
          flashcards={flashcardsGerados} 
          onSalvar={handleSalvarFlashcards} 
        />
      )}
    </div>
  );
};

export default PDFUploader;
