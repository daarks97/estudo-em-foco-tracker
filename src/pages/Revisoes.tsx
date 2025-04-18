
import React, { useState } from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Clock, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  CheckCheck, 
  AlertCircle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Revisoes = () => {
  const { 
    obterRevisoesHoje, 
    obterRevisoesAtrasadas, 
    marcarRevisaoConcluida, 
    categorias, 
    contarRevisoesPendentes 
  } = useEstudos();
  
  const [activeTab, setActiveTab] = useState('hoje');
  
  const revisoesHoje = obterRevisoesHoje();
  const revisoesAtrasadas = obterRevisoesAtrasadas();
  const contagemRevisoes = contarRevisoesPendentes();
  
  // Filtrar apenas as atrasadas para a aba "atrasadas"
  const apenasAtrasadas = revisoesHoje.filter(rev => rev.atrasada);
  
  // Filtrar apenas as de hoje para a aba "hoje"
  const apenasHoje = revisoesHoje.filter(rev => !rev.atrasada);
  
  const getNomeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? `${categoria.emoji} ${categoria.nome}` : 'Sem categoria';
  };
  
  const getTipoRevisaoTexto = (tipo: 'D1' | 'D7' | 'D30') => {
    switch (tipo) {
      case 'D1': return 'Revisão de 1 dia';
      case 'D7': return 'Revisão de 7 dias';
      case 'D30': return 'Revisão de 30 dias';
      default: return 'Revisão';
    }
  };
  
  const getTipoRevisaoBadge = (tipo: 'D1' | 'D7' | 'D30') => {
    switch (tipo) {
      case 'D1':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">D+1</Badge>;
      case 'D7':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">D+7</Badge>;
      case 'D30':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">D+30</Badge>;
      default:
        return null;
    }
  };

  const getStatusRevisaoTexto = (status: 'sucesso' | 'incompleta' | null) => {
    switch (status) {
      case 'sucesso': return 'Revisado com sucesso';
      case 'incompleta': return 'Revisão incompleta';
      default: return 'Não revisado';
    }
  };
  
  const renderRevisaoCard = (revisao: any, prefix: string = '') => {
    return (
      <Card 
        key={revisao.revisaoId} 
        className={`hover:shadow-md transition-shadow ${revisao.atrasada ? 'bg-red-50 border-red-100' : 'bg-white'}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-5 w-5 rounded-full">
                    <Checkbox className="opacity-0 absolute" />
                    <span className="sr-only">Selecionar status</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Status da revisão</h4>
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-green-600"
                        onClick={() => {
                          marcarRevisaoConcluida(revisao.temaId, revisao.revisaoId, true, 'sucesso');
                        }}
                      >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Revisado com sucesso
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-amber-600"
                        onClick={() => {
                          marcarRevisaoConcluida(revisao.temaId, revisao.revisaoId, true, 'incompleta');
                        }}
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Revisão incompleta
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-red-600"
                        onClick={() => {
                          marcarRevisaoConcluida(revisao.temaId, revisao.revisaoId, false);
                        }}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Não revisado
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-estudo-text">
                    {revisao.titulo}
                  </h3>
                  
                  <div className="text-sm text-gray-500 mt-1">
                    {getNomeCategoria(revisao.categoria)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {getTipoRevisaoBadge(revisao.tipo)}
                  {revisao.atrasada && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      <Clock size={12} className="mr-1" /> Atrasada
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  <span>
                    {getTipoRevisaoTexto(revisao.tipo)} - 
                    {revisao.atrasada 
                      ? ` Programada para ${format(revisao.dataRevisao, "dd/MM/yyyy", { locale: ptBR })}`
                      : ` Realizar hoje (${format(new Date(), "dd/MM/yyyy", { locale: ptBR })})`
                    }
                  </span>
                </div>
              </div>
              
              <div className="mt-1 text-xs text-gray-400 italic">
                <span>Para continuar o ciclo de revisões, marque como "Revisado com sucesso"</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
          <h1 className="text-2xl font-bold text-estudo-text">Revisões</h1>
        </div>
        
        <div className="mb-6 bg-white rounded-lg p-4 shadow">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-estudo-light rounded-full flex items-center justify-center">
              <RotateCcw className="h-6 w-6 text-estudo-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sistema de Revisão Espaçada</h2>
              <p className="text-sm text-gray-600">Revise os temas seguindo a sequência para melhor retenção</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <div className="flex items-start">
              <Info className="text-blue-500 mt-0.5 mr-2 h-5 w-5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Como funciona a revisão sequencial</h3>
                <p className="text-xs text-gray-700 mt-1">
                  Ao marcar um tema como concluído, ele entrará primeiro na revisão de 1 dia.
                  Quando completar esta revisão, o tema passará para a revisão de 7 dias,
                  e depois para a de 30 dias. Para avançar no ciclo, marque cada revisão como "Revisado com sucesso".
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center text-green-800 mb-1">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mr-2">D+1</Badge>
                <span className="font-medium">Revisão de 1 dia</span>
                <Badge className="ml-auto bg-green-500">{contagemRevisoes.D1}</Badge>
              </div>
              <p className="text-xs text-gray-600">Revisão realizada 1 dia após o estudo inicial</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-800 mb-1">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mr-2">D+7</Badge>
                <span className="font-medium">Revisão de 7 dias</span>
                <Badge className="ml-auto bg-blue-500">{contagemRevisoes.D7}</Badge>
              </div>
              <p className="text-xs text-gray-600">Revisão realizada 7 dias após concluir a revisão D+1</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div className="flex items-center text-purple-800 mb-1">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 mr-2">D+30</Badge>
                <span className="font-medium">Revisão de 30 dias</span>
                <Badge className="ml-auto bg-purple-500">{contagemRevisoes.D30}</Badge>
              </div>
              <p className="text-xs text-gray-600">Revisão realizada 30 dias após concluir a revisão D+7</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="hoje" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="hoje" className="relative">
              Hoje
              {apenasHoje.length > 0 && (
                <Badge className="ml-2 bg-estudo-primary">{apenasHoje.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="atrasadas" className="relative">
              Atrasadas
              {apenasAtrasadas.length > 0 && (
                <Badge className="ml-2 bg-red-500">{apenasAtrasadas.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="todas">
              Todas
              {revisoesHoje.length > 0 && (
                <Badge className="ml-2 bg-gray-500">{revisoesHoje.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hoje" className="space-y-4">
            {apenasHoje.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-gray-900 mb-1">Nenhuma revisão para hoje!</h3>
                <p className="text-gray-500">Todas as suas revisões de hoje foram concluídas ou não há revisões programadas.</p>
              </div>
            ) : (
              apenasHoje.map(revisao => renderRevisaoCard(revisao, 'hoje'))
            )}
          </TabsContent>
          
          <TabsContent value="atrasadas" className="space-y-4">
            {apenasAtrasadas.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-gray-900 mb-1">Nenhuma revisão atrasada!</h3>
                <p className="text-gray-500">Todas as suas revisões estão em dia. Continue assim!</p>
              </div>
            ) : (
              apenasAtrasadas.map(revisao => renderRevisaoCard(revisao, 'atrasada'))
            )}
          </TabsContent>
          
          <TabsContent value="todas" className="space-y-4">
            {revisoesHoje.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-gray-900 mb-1">Nenhuma revisão pendente!</h3>
                <p className="text-gray-500">Não há revisões pendentes para hoje ou atrasadas.</p>
              </div>
            ) : (
              revisoesHoje.map(revisao => renderRevisaoCard(revisao, 'todas'))
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-estudo-primary py-4 text-center text-white text-sm">
        Estudo em Foco - Seu assistente para preparação de residência
      </footer>
    </div>
  );
};

export default Revisoes;
