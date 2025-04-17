
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BuscaTemasProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const BuscaTemas = ({ searchTerm, setSearchTerm }: BuscaTemasProps) => {
  return (
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
  );
};

export default BuscaTemas;
