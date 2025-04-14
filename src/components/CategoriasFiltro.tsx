
import React from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import { Button } from '@/components/ui/button';

const CategoriasFiltro = () => {
  const { categorias, filtrarPorCategoria, categoriaAtual } = useEstudos();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-estudo-text">Filtrar por Categoria</h2>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={categoriaAtual === null ? "default" : "outline"}
          className={`${categoriaAtual === null ? 'bg-estudo-primary hover:bg-estudo-secondary' : ''}`}
          onClick={() => filtrarPorCategoria(null)}
        >
          Todas
        </Button>
        
        {categorias.map(categoria => (
          <Button
            key={categoria.id}
            variant={categoriaAtual === categoria.id ? "default" : "outline"}
            className={`${categoriaAtual === categoria.id ? 'bg-estudo-primary hover:bg-estudo-secondary' : ''}`}
            onClick={() => filtrarPorCategoria(categoria.id)}
          >
            {categoria.nome}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoriasFiltro;
