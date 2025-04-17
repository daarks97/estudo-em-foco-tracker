
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Baby, Scale, Brain } from 'lucide-react';

interface BadgesProps {
  prioridade: string;
  nivelAprendizado?: 'iniciado' | 'reforcando' | 'dominado';
  isAtrasado: boolean;
}

const BadgesTema = ({ prioridade, nivelAprendizado, isAtrasado }: BadgesProps) => {
  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge variant="outline" className="bg-[#FFEFED] text-[#FF3B30] rounded-full">Alta</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-[#FFF5EB] text-[#FF9500] rounded-full">Média</Badge>;
      case 'baixa':
        return <Badge variant="outline" className="bg-[#E5F2FF] text-[#007AFF] rounded-full">Baixa</Badge>;
      default:
        return null;
    }
  };

  const getNivelAprendizadoBadge = (nivel?: 'iniciado' | 'reforcando' | 'dominado') => {
    switch (nivel) {
      case 'iniciado':
        return (
          <Badge variant="outline" className="bg-[#E5F2FF] text-[#007AFF] rounded-full flex items-center">
            <Baby size={14} className="mr-1" /> Iniciado
          </Badge>
        );
      case 'reforcando':
        return (
          <Badge variant="outline" className="bg-[#FFF5EB] text-[#FF9500] rounded-full flex items-center">
            <Scale size={14} className="mr-1" /> Reforçando
          </Badge>
        );
      case 'dominado':
        return (
          <Badge variant="outline" className="bg-[#E3F8E9] text-[#34C759] rounded-full flex items-center">
            <Brain size={14} className="mr-1" /> Dominei
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2">
      {getPrioridadeBadge(prioridade)}
      {getNivelAprendizadoBadge(nivelAprendizado)}
      
      {isAtrasado && (
        <Badge variant="outline" className="bg-[#FFEFED] text-[#FF3B30] rounded-full">
          <Clock size={12} className="mr-1" /> Atrasado
        </Badge>
      )}
    </div>
  );
};

export default BadgesTema;
