
import React, { useState } from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import BuscaTemas from './temas/BuscaTemas';
import TemasEmptyState from './temas/TemasEmptyState';
import TemaItem from './temas/TemaItem';

const ListaTemas = () => {
  const { temasFiltrados, marcarConcluido, categorias, atualizarNivelAprendizado } = useEstudos();
  const [searchTerm, setSearchTerm] = useState('');
  
  const hoje = new Date();

  const getNomeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  };

  const isAtrasado = (tema: any) => {
    return tema.dataLimite && new Date(tema.dataLimite) < hoje && !tema.concluido;
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
      <BuscaTemas 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="grid grid-cols-1 gap-4">
        {filteredTemas.length === 0 ? (
          <TemasEmptyState searchTerm={searchTerm} />
        ) : (
          filteredTemas.map((tema) => (
            <TemaItem 
              key={tema.id}
              tema={tema} 
              marcarConcluido={marcarConcluido}
              atualizarNivelAprendizado={atualizarNivelAprendizado}
              getNomeCategoria={getNomeCategoria}
              isAtrasado={isAtrasado}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ListaTemas;
