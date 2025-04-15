
import React, { useState } from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CategoriasFiltro = () => {
  const { categorias, filtrarPorCategoria, categoriaAtual } = useEstudos();
  const [busca, setBusca] = useState('');

  const categoriasFiltradas = busca.length > 0
    ? categorias.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
    : categorias;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-estudo-text">Filtrar por Especialidade</h2>
      
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-estudo-gray h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar especialidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9 bg-gray-50 border-gray-100"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={categoriaAtual === null ? "default" : "outline"}
          className={`${categoriaAtual === null ? 'bg-estudo-primary hover:bg-estudo-secondary' : ''}`}
          onClick={() => filtrarPorCategoria(null)}
        >
          Todas
        </Button>
        
        {categoriasFiltradas.map(categoria => (
          <Button
            key={categoria.id}
            variant={categoriaAtual === categoria.id ? "default" : "outline"}
            className={`${categoriaAtual === categoria.id ? 'bg-estudo-primary hover:bg-estudo-secondary' : ''} flex items-center gap-1`}
            onClick={() => filtrarPorCategoria(categoria.id)}
          >
            <span>{categoria.emoji}</span>
            <span>{categoria.nome}</span>
          </Button>
        ))}
      </div>
      
      {categoriasFiltradas.length === 0 && (
        <div className="text-center text-estudo-gray mt-3">
          Nenhuma especialidade encontrada com "{busca}"
        </div>
      )}
    </div>
  );
};

export default CategoriasFiltro;
