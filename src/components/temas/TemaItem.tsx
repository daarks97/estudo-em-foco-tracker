
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BadgesTema from './BadgesTema';
import NivelAprendizadoPopover from './NivelAprendizadoPopover';
import { TemaEstudo } from '@/types/estudos';

interface TemaItemProps {
  tema: TemaEstudo;
  marcarConcluido: (id: string, concluido: boolean) => void;
  atualizarNivelAprendizado: (temaId: string, nivel: 'iniciado' | 'reforcando' | 'dominado') => void;
  getNomeCategoria: (categoriaId: string) => string;
  isAtrasado: (tema: TemaEstudo) => boolean;
}

const TemaItem = ({ 
  tema, 
  marcarConcluido, 
  atualizarNivelAprendizado,
  getNomeCategoria,
  isAtrasado
}: TemaItemProps) => {
  const atrasado = isAtrasado(tema);
  
  return (
    <Card 
      key={tema.id} 
      className={`hover:shadow-apple-hover transition-all duration-200 rounded-xl ${
        tema.concluido 
          ? 'bg-[#F2FFF5] border-[#D1F2D9]' 
          : atrasado
          ? 'bg-[#FFEFED] border-[#FFD7D5]'
          : 'bg-white'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Checkbox 
              id={`tema-${tema.id}`}
              checked={tema.concluido}
              onCheckedChange={(checked) => {
                marcarConcluido(tema.id, checked as boolean);
              }}
              className={`${tema.concluido ? 'bg-[#34C759] border-[#34C759]' : 'border-gray-300'}`}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <label 
                  htmlFor={`tema-${tema.id}`}
                  className={`font-medium cursor-pointer ${
                    tema.concluido ? 'line-through text-estudo-gray' : 'text-estudo-text'
                  }`}
                >
                  {tema.titulo}
                </label>
                
                <div className="text-sm text-estudo-gray mt-1">
                  {getNomeCategoria(tema.categoria)}
                </div>
              </div>
              
              <BadgesTema 
                prioridade={tema.prioridade} 
                nivelAprendizado={tema.nivelAprendizado}
                isAtrasado={atrasado}
              />
            </div>
            
            <div className="mt-3 flex items-center text-sm text-estudo-gray">
              {tema.dataLimite && (
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  <span className={`${atrasado ? 'text-[#FF3B30] font-medium' : ''}`}>
                    Data limite: {format(new Date(tema.dataLimite), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
              )}
              
              {tema.concluido && tema.dataConclusao && (
                <div className="flex items-center ml-4">
                  <span className="text-[#34C759]">
                    ✓ Concluído em: {format(new Date(tema.dataConclusao), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              )}
            </div>

            {!tema.concluido && (
              <div className="mt-2">
                <NivelAprendizadoPopover 
                  temaId={tema.id}
                  atualizarNivelAprendizado={atualizarNivelAprendizado}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemaItem;
