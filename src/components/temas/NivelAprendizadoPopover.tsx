
import React from 'react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Baby, Scale, Brain } from 'lucide-react';

interface NivelAprendizadoPopoverProps {
  temaId: string;
  atualizarNivelAprendizado: (temaId: string, nivel: 'iniciado' | 'reforcando' | 'dominado') => void;
}

const NivelAprendizadoPopover = ({ temaId, atualizarNivelAprendizado }: NivelAprendizadoPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs rounded-full border border-gray-200 mt-2"
        >
          Nível de aprendizado
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3 rounded-xl shadow-apple" align="start">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Definir nível</h4>
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-[#007AFF] hover:bg-[#E5F2FF]"
              onClick={() => {
                atualizarNivelAprendizado(temaId, 'iniciado');
              }}
            >
              <Baby className="mr-2 h-4 w-4" />
              Iniciado
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-[#FF9500] hover:bg-[#FFF5EB]"
              onClick={() => {
                atualizarNivelAprendizado(temaId, 'reforcando');
              }}
            >
              <Scale className="mr-2 h-4 w-4" />
              Reforçando
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-[#34C759] hover:bg-[#E3F8E9]"
              onClick={() => {
                atualizarNivelAprendizado(temaId, 'dominado');
              }}
            >
              <Brain className="mr-2 h-4 w-4" />
              Dominei
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NivelAprendizadoPopover;
