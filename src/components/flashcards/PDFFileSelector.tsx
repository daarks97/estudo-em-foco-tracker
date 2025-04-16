
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, ArrowRight } from 'lucide-react';

interface PDFFileSelectorProps {
  arquivoSelecionado: File | null;
  onFileChange: (file: File) => void;
  onCancelar: () => void;
  onProcessar: () => void;
  processando: boolean;
}

const PDFFileSelector: React.FC<PDFFileSelectorProps> = ({ 
  arquivoSelecionado, 
  onFileChange, 
  onCancelar, 
  onProcessar,
  processando 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selecionarArquivo = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
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
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              style={{ display: 'none' }}
            />
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
  );
};

export default PDFFileSelector;
