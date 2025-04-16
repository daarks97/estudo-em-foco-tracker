
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, RotateCcw, Search, Menu, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import HeaderUser from '@/components/HeaderUser';
import { useMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { isMobile } = useMobile();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-estudo-primary' : 'text-estudo-gray hover:text-estudo-primary';
  };
  
  const routes = [
    {
      path: '/',
      label: 'Dashboard',
    },
    {
      path: '/novo-tema',
      label: 'Novo Tema',
    },
    {
      path: '/revisoes',
      label: 'Revisões',
    },
    {
      path: '/flashcards',
      label: 'Flashcards',
    },
  ];
  
  const renderNavLinks = () => (
    <nav className="flex items-center space-x-6">
      {routes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={`text-sm font-medium transition-colors ${isActive(route.path)}`}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl text-estudo-primary mr-8">
            Estudo<span className="text-estudo-accent">CV</span>
          </Link>
          
          {!isMobile && renderNavLinks()}
        </div>
        
        <div className="flex items-center gap-4">
          {!isMobile && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/revisoes" className="gap-1">
                  <RotateCcw className="h-4 w-4" />
                  Revisões
                </Link>
              </Button>
              
              <Button asChild size="sm">
                <Link to="/novo-tema" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Novo Tema
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm">
                <Link to="/flashcards" className="gap-1">
                  <BrainCircuit className="h-4 w-4" />
                  Flashcards
                </Link>
              </Button>
            </>
          )}
          
          <HeaderUser />
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link to="/" className="font-bold text-xl text-estudo-primary inline-block mb-6">
                  Estudo<span className="text-estudo-accent">CV</span>
                </Link>
                
                <nav className="flex flex-col space-y-4">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      className={`text-sm font-medium transition-colors ${isActive(route.path)}`}
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>
                
                <Separator className="my-6" />
                
                <div className="flex flex-col space-y-3">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/revisoes" className="justify-start gap-2 w-full">
                      <RotateCcw className="h-4 w-4" />
                      Revisões
                    </Link>
                  </Button>
                  
                  <Button asChild size="sm">
                    <Link to="/novo-tema" className="justify-start gap-2 w-full">
                      <PlusCircle className="h-4 w-4" />
                      Novo Tema
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="sm">
                    <Link to="/flashcards" className="justify-start gap-2 w-full">
                      <BrainCircuit className="h-4 w-4" />
                      Flashcards
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
