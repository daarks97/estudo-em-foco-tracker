
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  X, 
  Check, 
  Calendar, 
  Clock, 
  FileText, 
  MoreVertical,
  Trash2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FlashcardsList = ({ flashcards, onMarcarRevisado, onExcluir }) => {
  const [activeFlashcardId, setActiveFlashcardId] = useState(null);
  const [mostrarResposta, setMostrarResposta] = useState({});

  const toggleMostrarResposta = (id) => {
    setMostrarResposta(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderOrigem = (origem) => {
    switch (origem) {
      case 'google_docs':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Google Docs</Badge>;
      case 'pdf':
        return <Badge variant="outline" className="bg-red-100 text-red-800">PDF</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };

  const formatarData = (data) => {
    if (!data) return 'Não revisado';
    
    try {
      const date = new Date(data);
      return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatarTempoRelativo = (data) => {
    if (!data) return '';
    
    try {
      const date = new Date(data);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {flashcards.map((flashcard) => (
        <Card 
          key={flashcard.id} 
          className={`border-l-4 ${flashcard.revisado ? 'border-l-green-500' : 'border-l-amber-500'}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{flashcard.pergunta}</h3>
                
                <div className="flex items-center gap-2 text-sm text-estudo-gray mt-3">
                  {renderOrigem(flashcard.origem)}
                  {flashcard.nome_arquivo && (
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      <span>{flashcard.nome_arquivo}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => onMarcarRevisado(flashcard.id, !flashcard.revisado)}
                    className="cursor-pointer"
                  >
                    {flashcard.revisado ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Marcar como não revisado</span>
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Marcar como revisado</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onExcluir(flashcard.id)}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir flashcard</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Ver resposta
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Resposta</DialogTitle>
                  </DialogHeader>
                  <div className="p-4 bg-gray-50 rounded-md border mt-2">
                    {flashcard.resposta}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-4 flex items-center text-xs text-gray-500">
              {flashcard.revisado ? (
                <>
                  <Check className="text-green-500 mr-1 h-4 w-4" />
                  <span>Revisado {formatarTempoRelativo(flashcard.data_revisao)}</span>
                </>
              ) : (
                <>
                  <Clock className="text-amber-500 mr-1 h-4 w-4" />
                  <span>Não revisado</span>
                </>
              )}
              <span className="mx-2">•</span>
              <Calendar className="mr-1 h-3 w-3" />
              <span>Criado {formatarTempoRelativo(flashcard.data_criacao)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlashcardsList;
