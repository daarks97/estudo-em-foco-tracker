
import React from 'react';
import { Search } from 'lucide-react';

interface TemasEmptyStateProps {
  searchTerm: string;
}

const TemasEmptyState = ({ searchTerm }: TemasEmptyStateProps) => {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <Search className="h-8 w-8 text-estudo-gray" />
      </div>
      <p className="text-estudo-gray">
        {searchTerm.trim() !== '' ? 'Nenhum tema encontrado para esta busca.' : 'Nenhum tema encontrado.'}
      </p>
    </div>
  );
};

export default TemasEmptyState;
