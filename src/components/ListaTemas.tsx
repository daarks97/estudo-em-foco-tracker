
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Clock, 
  Baby, 
  Scale, 
  Brain,
  Search
} from 'lucide-react';

const ListaTemas = () => {
  const { temasFiltrados, marcarConcluido, categorias, atualizarNivelAprendizado } = useEstudos();
  const [searchTerm, setSearchTerm] = useState('');
  
  const hoje = new Date();

  const getNomeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  };

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

  const isAtrasado = (tema: any) => {
    return tema.dataLimite && new Date(tema.dataLimite) < hoje && !tema.concluido;
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

  // Filter topics based on search term
  const filteredTemas = searchTerm.trim() === '' 
    ? temasFiltrados 
    : temasFiltrados.filter(tema => 
        tema.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getNomeCategoria(tema.categoria).toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-estudo-text">Temas de Estudo</h2>
        
        <div className="relative w-full max-w-xs">
          <Input
            type="text"
            placeholder="Buscar temas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full rounded-full border border-gray-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-estudo-gray" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredTemas.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Search className="h-8 w-8 text-estudo-gray" />
            </div>
            <p className="text-estudo-gray">
              {searchTerm.trim() !== '' ? 'Nenhum tema encontrado para esta busca.' : 'Nenhum tema encontrado.'}
            </p>
          </div>
        ) : (
          filteredTemas.map((tema) => (
            <Card 
              key={tema.id} 
              className={`hover:shadow-apple-hover transition-all duration-200 rounded-xl ${
                tema.concluido 
                  ? 'bg-[#F2FFF5] border-[#D1F2D9]' 
                  : isAtrasado(tema)
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
                      
                      <div className="flex gap-2">
                        {getPrioridadeBadge(tema.prioridade)}
                        {getNivelAprendizadoBadge(tema.nivelAprendizado)}
                        
                        {isAtrasado(tema) && (
                          <Badge variant="outline" className="bg-[#FFEFED] text-[#FF3B30] rounded-full">
                            <Clock size={12} className="mr-1" /> Atrasado
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-estudo-gray">
                      {tema.dataLimite && (
                        <div className="flex items-center">
                          <CalendarIcon size={14} className="mr-1" />
                          <span className={`${isAtrasado(tema) ? 'text-[#FF3B30] font-medium' : ''}`}>
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
                                    atualizarNivelAprendizado(tema.id, 'iniciado');
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
                                    atualizarNivelAprendizado(tema.id, 'reforcando');
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
