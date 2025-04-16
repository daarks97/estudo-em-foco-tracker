
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import FlashcardsHeader from '@/components/flashcards/FlashcardsHeader';
import FlashcardsTabs from '@/components/flashcards/FlashcardsTabs';
import { useFlashcards } from '@/hooks/use-flashcards';

const Flashcards = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('meus-flashcards');
  
  const {
    flashcards,
    loading,
    markAsReviewed,
    deleteFlashcard,
    saveFlashcards
  } = useFlashcards(user?.id);

  const handleSaveFlashcards = async (flashcards: any[], origem: string, nomeArquivo: string) => {
    const success = await saveFlashcards(flashcards, origem, nomeArquivo);
    if (success) {
      setActiveTab('meus-flashcards');
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-estudo-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <FlashcardsHeader onTabChange={setActiveTab} />
        
        <FlashcardsTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          loading={loading}
          flashcards={flashcards}
          onSaveFlashcards={handleSaveFlashcards}
          onMarkReviewed={markAsReviewed}
          onDeleteFlashcard={deleteFlashcard}
        />
      </main>
      
      <footer className="bg-estudo-primary py-4 text-center text-white text-sm">
        Estudo em Foco - Seu assistente para preparação de residência
      </footer>
    </div>
  );
};

export default Flashcards;
