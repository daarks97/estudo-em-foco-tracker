
import React from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Filter,
  X,
  Book,
  Flag,
  Brain
} from 'lucide-react';

const FiltrosAvancados = () => {
  const { 
    categorias, 
    filtrarPorCategoria, 
    filtrarPorPrioridade, 
    filtrarPorNivelAprendizado,
    resetarFiltros,
    categoriaAtual,
    prioridadeAtual,
    nivelAprendizadoAtual
  } = useEstudos();

  const temFiltrosAtivos = categoriaAtual || prioridadeAtual || nivelAprendizadoAtual;

  return (
    <div className="mb-4 flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Book className="h-4 w-4 mr-1" />
                Categorias
              </h3>
              <div className="flex flex-wrap gap-2">
                {categorias.map(categoria => (
                  <Badge 
                    key={categoria.id}
                    variant={categoriaAtual === categoria.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => filtrarPorCategoria(categoriaAtual === categoria.id ? null : categoria.id)}
                  >
                    {categoria.emoji} {categoria.nome}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Flag className="h-4 w-4 mr-1" />
                Prioridade
              </h3>
              <div className="flex gap-2">
                <Badge 
                  variant={prioridadeAtual === 'alta' ? "default" : "outline"}
                  className="cursor-pointer bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                  onClick={() => filtrarPorPrioridade(prioridadeAtual === 'alta' ? null : 'alta')}
                >
                  Alta
                </Badge>
                <Badge 
                  variant={prioridadeAtual === 'media' ? "default" : "outline"}
                  className="cursor-pointer bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                  onClick={() => filtrarPorPrioridade(prioridadeAtual === 'media' ? null : 'media')}
                >
                  Média
                </Badge>
                <Badge 
                  variant={prioridadeAtual === 'baixa' ? "default" : "outline"}
                  className="cursor-pointer bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                  onClick={() => filtrarPorPrioridade(prioridadeAtual === 'baixa' ? null : 'baixa')}
                >
                  Baixa
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-1" />
                Nível de aprendizado
              </h3>
              <div className="flex gap-2">
                <Badge 
                  variant={nivelAprendizadoAtual === 'iniciado' ? "default" : "outline"}
                  className="cursor-pointer bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                  onClick={() => filtrarPorNivelAprendizado(nivelAprendizadoAtual === 'iniciado' ? null : 'iniciado')}
                >
                  Iniciado
                </Badge>
                <Badge 
                  variant={nivelAprendizadoAtual === 'reforcando' ? "default" : "outline"}
                  className="cursor-pointer bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                  onClick={() => filtrarPorNivelAprendizado(nivelAprendizadoAtual === 'reforcando' ? null : 'reforcando')}
                >
                  Reforçando
                </Badge>
                <Badge 
                  variant={nivelAprendizadoAtual === 'dominado' ? "default" : "outline"}
                  className="cursor-pointer bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                  onClick={() => filtrarPorNivelAprendizado(nivelAprendizadoAtual === 'dominado' ? null : 'dominado')}
                >
                  Dominei
                </Badge>
              </div>
            </div>

            {temFiltrosAtivos && (
              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-red-600"
                  onClick={resetarFiltros}
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {temFiltrosAtivos && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Filtros ativos:</span>
          
          {categoriaAtual && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categorias.find(c => c.id === categoriaAtual)?.emoji}{' '}
              {categorias.find(c => c.id === categoriaAtual)?.nome}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => filtrarPorCategoria(null)}
              />
            </Badge>
          )}
          
          {prioridadeAtual && (
            <Badge 
              variant="secondary" 
              className={`flex items-center gap-1 ${
                prioridadeAtual === 'alta' ? 'bg-red-100' : 
                prioridadeAtual === 'media' ? 'bg-amber-100' : 'bg-blue-100'
              }`}
            >
              Prioridade: {prioridadeAtual.charAt(0).toUpperCase() + prioridadeAtual.slice(1)}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => filtrarPorPrioridade(null)}
              />
            </Badge>
          )}
          
          {nivelAprendizadoAtual && (
            <Badge 
              variant="secondary" 
              className={`flex items-center gap-1 ${
                nivelAprendizadoAtual === 'iniciado' ? 'bg-blue-100' : 
                nivelAprendizadoAtual === 'reforcando' ? 'bg-amber-100' : 'bg-green-100'
              }`}
            >
              Nível: {nivelAprendizadoAtual.charAt(0).toUpperCase() + nivelAprendizadoAtual.slice(1)}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => filtrarPorNivelAprendizado(null)}
              />
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-red-600"
            onClick={resetarFiltros}
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
};

export default FiltrosAvancados;
