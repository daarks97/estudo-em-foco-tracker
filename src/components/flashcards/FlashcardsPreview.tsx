
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Flashcard {
  pergunta: string;
  resposta: string;
}

interface FlashcardsPreviewProps {
  flashcards: Flashcard[];
  onSalvar: () => void;
}

const FlashcardsPreview: React.FC<FlashcardsPreviewProps> = ({ flashcards, onSalvar }) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {flashcards.length} Flashcards Gerados
        </h3>
        <Button 
          onClick={onSalvar}
          className="bg-green-600 hover:bg-green-700"
        >
          Salvar Flashcards
        </Button>
      </div>
      
      <div className="space-y-4">
        {flashcards.map((card, index) => (
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
  );
};

export default FlashcardsPreview;
