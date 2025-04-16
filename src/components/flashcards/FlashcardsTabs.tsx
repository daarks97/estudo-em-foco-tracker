
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import FlashcardsList from './FlashcardsList';
import EmptyFlashcards from './EmptyFlashcards';
import GoogleDocsImporter from './GoogleDocsImporter';
import PDFUploader from './PDFUploader';
import { Flashcard } from '@/hooks/use-flashcards';

interface FlashcardsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  loading: boolean;
  flashcards: Flashcard[];
  onSaveFlashcards: (flashcards: any[], origem: string, nomeArquivo: string) => Promise<boolean>;
  onMarkReviewed: (id: string, revisado: boolean) => Promise<void>;
  onDeleteFlashcard: (id: string) => Promise<void>;
}

const FlashcardsTabs: React.FC<FlashcardsTabsProps> = ({
  activeTab,
  onTabChange,
  loading,
  flashcards,
  onSaveFlashcards,
  onMarkReviewed,
  onDeleteFlashcard
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="meus-flashcards">Meus Flashcards</TabsTrigger>
        <TabsTrigger value="importar-google">Google Docs</TabsTrigger>
        <TabsTrigger value="importar-pdf">PDF</TabsTrigger>
      </TabsList>
      
      <TabsContent value="meus-flashcards">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-estudo-primary" />
          </div>
        ) : flashcards.length === 0 ? (
          <EmptyFlashcards />
        ) : (
          <FlashcardsList 
            flashcards={flashcards} 
            onMarcarRevisado={onMarkReviewed}
            onExcluir={onDeleteFlashcard}
          />
        )}
      </TabsContent>
      
      <TabsContent value="importar-google">
        <GoogleDocsImporter onSalvarFlashcards={onSaveFlashcards} />
      </TabsContent>
      
      <TabsContent value="importar-pdf">
        <PDFUploader onSalvarFlashcards={onSaveFlashcards} />
      </TabsContent>
    </Tabs>
  );
};

export default FlashcardsTabs;
