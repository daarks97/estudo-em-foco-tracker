
import React from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Clock, 
  Baby, 
  Scale, 
  Brain
} from 'lucide-react';

const ListaTemas = () => {
  const { temasFiltrados, marcarConcluido, categorias, atualizarNivelAprendizado } = useEstudos();

  const hoje = new Date();

  const getNomeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Alta</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Média</Badge>;
      case 'baixa':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Baixa</Badge>;
      default:
        return null;
    }
  };

  const isAtrasado = (tema: any) => {
    return tema.dataLimite && new Date(tema.dataLimite) < hoje && !tema.concluido;
  };

  const getNivelAprendizadoBadge = (nivel?: 'iniciado' | 'reforcando' | 'dominado') => {
    switch (nivel) {
      case 'iniciado':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center">
            <Baby size={14} className="mr-1" /> Iniciado
          </Badge>
        );
      case 'reforcando':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center">
            <Scale size={14} className="mr-1" /> Reforçando
          </Badge>
        );
      case 'dominado':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center">
            <Brain size={14} className="mr-1" /> Dominei
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-estudo-text">Temas de Estudo</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {temasFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum tema encontrado.</p>
        ) : (
          temasFiltrados.map((tema) => (
            <Card 
              key={tema.id} 
              className={`hover:shadow-md transition-shadow ${
                tema.concluido 
                  ? 'bg-green-50 border-green-100' 
                  : isAtrasado(tema)
                  ? 'bg-red-50 border-red-100'
                  : 'bg-white'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={`tema-${tema.id}`}
                    checked={tema.concluido}
                    onCheckedChange={(checked) => {
                      marcarConcluido(tema.id, checked as boolean);
                    }}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <label 
                          htmlFor={`tema-${tema.id}`}
                          className={`font-medium cursor-pointer ${
                            tema.concluido ? 'line-through text-gray-500' : 'text-estudo-text'
                          }`}
                        >
                          {tema.titulo}
                        </label>
                        
                        <div className="text-sm text-gray-500 mt-1">
                          {getNomeCategoria(tema.categoria)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {getPrioridadeBadge(tema.prioridade)}
                        {getNivelAprendizadoBadge(tema.nivelAprendizado)}
                        
                        {isAtrasado(tema) && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            <Clock size={12} className="mr-1" /> Atrasado
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      {tema.dataLimite && (
                        <div className="flex items-center">
                          <CalendarIcon size={14} className="mr-1" />
                          <span className={`${isAtrasado(tema) ? 'text-red-500 font-medium' : ''}`}>
                            Data limite: {format(new Date(tema.dataLimite), "dd 'de' MMMM", { locale: ptBR })}
                          </span>
                        </div>
                      )}
                      
                      {tema.concluido && tema.dataConclusao && (
                        <div className="flex items-center ml-4">
                          <span className="text-green-600">
                            ✓ Concluído em: {format(new Date(tema.dataConclusao), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      )}
                    </div>

                    {!tema.concluido && (
                      <div className="mt-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                            >
                              Nível de aprendizado
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-3" align="start">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Definir nível</h4>
                              <div className="space-y-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full justify-start text-blue-600"
                                  onClick={() => {
                                    atualizarNivelAprendizado(tema.id, 'iniciado');
                                  }}
                                >
                                  <Baby className="mr-2 h-4 w-4" />
                                  Iniciado
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full justify-start text-amber-600"
                                  onClick={() => {
                                    atualizarNivelAprendizado(tema.id, 'reforcando');
                                  }}
                                >
                                  <Scale className="mr-2 h-4 w-4" />
                                  Reforçando
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full justify-start text-green-600"
                                  onClick={() => {
                                    atualizarNivelAprendizado(tema.id, 'dominado');
                                  }}
                                >
                                  <Brain className="mr-2 h-4 w-4" />
                                  Dominei
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ListaTemas;
