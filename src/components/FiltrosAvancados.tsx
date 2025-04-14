
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
    <div className="mb-6 flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1 border border-gray-200 shadow-sm">
            <Filter className="h-4 w-4 text-estudo-primary" />
            <span className="text-estudo-text">Filtros</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-5 rounded-2xl shadow-apple" align="start">
          <div className="space-y-5">
            <div>
              <h3 className="font-medium text-sm mb-3 flex items-center text-estudo-text">
                <Book className="h-4 w-4 mr-2 text-estudo-primary" />
                Categorias
              </h3>
              <div className="flex flex-wrap gap-2">
                {categorias.map(categoria => (
                  <Badge 
                    key={categoria.id}
                    variant={categoriaAtual === categoria.id ? "default" : "outline"}
                    className={`cursor-pointer rounded-full px-3 py-1 ${
                      categoriaAtual === categoria.id 
                        ? 'bg-estudo-primary text-white hover:bg-estudo-primary/90' 
                        : 'bg-gray-50 text-estudo-text hover:bg-gray-100'
                    }`}
                    onClick={() => filtrarPorCategoria(categoriaAtual === categoria.id ? null : categoria.id)}
                  >
                    {categoria.emoji} {categoria.nome}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-3 flex items-center text-estudo-text">
                <Flag className="h-4 w-4 mr-2 text-estudo-primary" />
                Prioridade
              </h3>
              <div className="flex gap-2">
                <Badge 
                  variant={prioridadeAtual === 'alta' ? "default" : "outline"}
                  className={`cursor-pointer rounded-full px-3 py-1 ${
                    prioridadeAtual === 'alta' 
                      ? 'bg-[#FF3B30] text-white hover:bg-[#FF3B30]/90' 
                      : 'bg-[#FFEFED] text-[#FF3B30] hover:bg-[#FFEFED]/80'
                  }`}
                  onClick={() => filtrarPorPrioridade(prioridadeAtual === 'alta' ? null : 'alta')}
                >
                  Alta
                </Badge>
                <Badge 
                  variant={prioridadeAtual === 'media' ? "default" : "outline"}
                  className={`cursor-pointer rounded-full px-3 py-1 ${
                    prioridadeAtual === 'media' 
                      ? 'bg-[#FF9500] text-white hover:bg-[#FF9500]/90' 
                      : 'bg-[#FFF5EB] text-[#FF9500] hover:bg-[#FFF5EB]/80'
                  }`}
                  onClick={() => filtrarPorPrioridade(prioridadeAtual === 'media' ? null : 'media')}
                >
                  Média
                </Badge>
                <Badge 
                  variant={prioridadeAtual === 'baixa' ? "default" : "outline"}
                  className={`cursor-pointer rounded-full px-3 py-1 ${
                    prioridadeAtual === 'baixa' 
                      ? 'bg-[#007AFF] text-white hover:bg-[#007AFF]/90' 
                      : 'bg-[#E5F2FF] text-[#007AFF] hover:bg-[#E5F2FF]/80'
                  }`}
                  onClick={() => filtrarPorPrioridade(prioridadeAtual === 'baixa' ? null : 'baixa')}
                >
                  Baixa
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-3 flex items-center text-estudo-text">
                <Brain className="h-4 w-4 mr-2 text-estudo-primary" />
                Nível de aprendizado
              </h3>
              <div className="flex gap-2">
                <Badge 
                  variant={nivelAprendizadoAtual === 'iniciado' ? "default" : "outline"}
                  className={`cursor-pointer rounded-full px-3 py-1 ${
                    nivelAprendizadoAtual === 'iniciado' 
                      ? 'bg-[#007AFF] text-white hover:bg-[#007AFF]/90' 
                      : 'bg-[#E5F2FF] text-[#007AFF] hover:bg-[#E5F2FF]/80'
                  }`}
                  onClick={() => filtrarPorNivelAprendizado(nivelAprendizadoAtual === 'iniciado' ? null : 'iniciado')}
                >
                  Iniciado
                </Badge>
                <Badge 
                  variant={nivelAprendizadoAtual === 'reforcando' ? "default" : "outline"}
                  className={`cursor-pointer rounded-full px-3 py-1 ${
                    nivelAprendizadoAtual === 'reforcando' 
                      ? 'bg-[#FF9500] text-white hover:bg-[#FF9500]/90' 
                      : 'bg-[#FFF5EB] text-[#FF9500] hover:bg-[#FFF5EB]/80'
                  }`}
                  onClick={() => filtrarPorNivelAprendizado(nivelAprendizadoAtual === 'reforcando' ? null : 'reforcando')}
                >
                  Reforçando
                </Badge>
                <Badge 
                  variant={nivelAprendizadoAtual === 'dominado' ? "default" : "outline"}
                  className={`cursor-pointer rounded-full px-3 py-1 ${
                    nivelAprendizadoAtual === 'dominado' 
                      ? 'bg-[#34C759] text-white hover:bg-[#34C759]/90' 
                      : 'bg-[#E3F8E9] text-[#34C759] hover:bg-[#E3F8E9]/80'
                  }`}
                  onClick={() => filtrarPorNivelAprendizado(nivelAprendizadoAtual === 'dominado' ? null : 'dominado')}
                >
                  Dominei
                </Badge>
              </div>
            </div>

            {temFiltrosAtivos && (
              <div className="pt-3 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-[#FF3B30] hover:bg-[#FFEFED] hover:text-[#FF3B30]"
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
          <span className="text-sm text-estudo-gray">Filtros ativos:</span>
          
          {categoriaAtual && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-gray-50 text-estudo-text rounded-full">
              {categorias.find(c => c.id === categoriaAtual)?.emoji}{' '}
              {categorias.find(c => c.id === categoriaAtual)?.nome}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer text-estudo-gray" 
                onClick={() => filtrarPorCategoria(null)}
              />
            </Badge>
          )}
          
          {prioridadeAtual && (
            <Badge 
              variant="secondary" 
              className={`flex items-center gap-1 rounded-full ${
                prioridadeAtual === 'alta' ? 'bg-[#FFEFED] text-[#FF3B30]' : 
                prioridadeAtual === 'media' ? 'bg-[#FFF5EB] text-[#FF9500]' : 
                'bg-[#E5F2FF] text-[#007AFF]'
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
              className={`flex items-center gap-1 rounded-full ${
                nivelAprendizadoAtual === 'iniciado' ? 'bg-[#E5F2FF] text-[#007AFF]' : 
                nivelAprendizadoAtual === 'reforcando' ? 'bg-[#FFF5EB] text-[#FF9500]' : 
                'bg-[#E3F8E9] text-[#34C759]'
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
            className="h-7 px-2 text-[#FF3B30] hover:bg-[#FFEFED] rounded-full"
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
