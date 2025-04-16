
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

const PDFInfoAlert: React.FC = () => {
  return (
    <Alert className="mb-6">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Como funciona</AlertTitle>
      <AlertDescription>
        Faça upload de um arquivo PDF com seu resumo de estudos.
        Nossa IA irá extrair o texto e gerar automaticamente flashcards para você revisar.
      </AlertDescription>
    </Alert>
  );
};

export default PDFInfoAlert;
