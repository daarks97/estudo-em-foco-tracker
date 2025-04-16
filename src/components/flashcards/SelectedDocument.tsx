
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { GoogleDocument } from '@/hooks/use-google-docs';

interface SelectedDocumentProps {
  documento: GoogleDocument;
  onMudar: () => void;
  onCancelar: () => void;
  onProcessar: () => void;
  processando: boolean;
}

const SelectedDocument: React.FC<SelectedDocumentProps> = ({ 
  documento, 
  onMudar, 
  onCancelar, 
  onProcessar,
  processando 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <p className="font-medium">{documento.name}</p>
            <p className="text-sm text-gray-500">Google Docs</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={onMudar}
        >
          Mudar
        </Button>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onCancelar}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onProcessar} 
          disabled={processando}
        >
          {processando ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </>
          ) : (
            <>
              Processar Documento
              <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SelectedDocument;
