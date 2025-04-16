
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Plus } from 'lucide-react';

interface FlashcardsHeaderProps {
  onTabChange: (tab: string) => void;
}

const FlashcardsHeader: React.FC<FlashcardsHeaderProps> = ({ onTabChange }) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <FileText className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-estudo-text">Flashcards</h1>
      </div>
      
      <div className="mb-6 bg-white rounded-lg p-6 shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-estudo-text">Estude com Flashcards</h2>
            <p className="text-sm text-estudo-gray mt-1">
              Gere flashcards automaticamente a partir dos seus resumos
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => onTabChange('importar-google')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar do Google Docs
            </Button>
            
            <Button 
              onClick={() => onTabChange('importar-pdf')}
              className="bg-estudo-primary hover:bg-estudo-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Enviar PDF
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashcardsHeader;
