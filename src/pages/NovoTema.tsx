
import React, { useState } from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ptBR } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NovoTema = () => {
  const { categorias, adicionarTema } = useEstudos();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [dataEstudo, setDataEstudo] = useState<Date>(new Date());
  const [dataLimite, setDataLimite] = useState<Date | null>(null);
  const [prioridade, setPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para adicionar um tema.");
      return;
    }
    
    if (!titulo || !categoria) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await adicionarTema({
        titulo,
        categoria,
        dataEstudo,
        dataLimite,
        concluido: false,
        dataConclusao: null,
        prioridade
      });
      
      toast.success("Tema adicionado com sucesso!");
      navigate('/');
    } catch (error) {
      console.error("Erro ao adicionar tema:", error);
      toast.error("Ocorreu um erro ao adicionar o tema.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-estudo-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-estudo-text">Adicionar Novo Tema</h1>
        </div>
        
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Informações do Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Tema</Label>
                  <Input 
                    id="titulo" 
                    placeholder="Ex: Hipertensão Arterial" 
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select 
                    value={categoria} 
                    onValueChange={setCategoria}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Data do Estudo</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataEstudo ? format(dataEstudo, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataEstudo}
                        onSelect={(date) => date && setDataEstudo(date)}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Data Limite (opcional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataLimite ? format(dataLimite, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data limite (opcional)"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataLimite}
                        onSelect={setDataLimite}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <RadioGroup 
                    value={prioridade} 
                    onValueChange={(val) => setPrioridade(val as 'baixa' | 'media' | 'alta')}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="baixa" id="baixa" />
                      <Label htmlFor="baixa" className="text-blue-600">Baixa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="media" id="media" />
                      <Label htmlFor="media" className="text-amber-600">Média</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alta" id="alta" />
                      <Label htmlFor="alta" className="text-red-600">Alta</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-estudo-primary hover:bg-estudo-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adicionando..." : "Adicionar Tema"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-estudo-primary py-4 text-center text-white text-sm">
        Estudo em Foco - Seu assistente para preparação de residência
      </footer>
    </div>
  );
};

export default NovoTema;
