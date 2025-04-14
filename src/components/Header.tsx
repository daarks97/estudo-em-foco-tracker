
import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-estudo-primary shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen size={32} className="text-white" />
          <h1 className="text-2xl font-bold text-white">Estudo em Foco</h1>
        </div>
        <div className="text-white text-sm">
          Organizando sua preparação para a residência
        </div>
      </div>
    </header>
  );
};

export default Header;
