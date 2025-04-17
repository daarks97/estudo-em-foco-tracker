
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const EmptyFlashcards: React.FC = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Nenhum flashcard encontrado</AlertTitle>
      <AlertDescription>
        Você ainda não tem flashcards. Importe um documento do Google Drive ou faça upload de um PDF para gerar flashcards.
      </AlertDescription>
    </Alert>
  );
};

export default EmptyFlashcards;
