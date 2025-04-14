
import React from 'react';
import { BookOpen, PlusCircle, RotateCcw, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-estudo-primary shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen size={32} className="text-white" />
            <h1 className="text-2xl font-bold text-white">Estudo em Foco</h1>
          </div>
          
          <div className="flex space-x-1">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? "secondary" : "ghost"} 
                size="sm" 
                className="text-white hover:text-white hover:bg-estudo-secondary"
              >
                <Home className="mr-1 h-4 w-4" />
                <span>Início</span>
              </Button>
            </Link>
            
            <Link to="/revisoes">
              <Button 
                variant={location.pathname === '/revisoes' ? "secondary" : "ghost"} 
                size="sm" 
                className="text-white hover:text-white hover:bg-estudo-secondary"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                <span>Revisões</span>
              </Button>
            </Link>
            
            <Link to="/novo-tema">
              <Button 
                variant={location.pathname === '/novo-tema' ? "secondary" : "ghost"} 
                size="sm" 
                className="text-white hover:text-white hover:bg-estudo-secondary"
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                <span>Novo Tema</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
