
import React, { useState } from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Revisoes = () => {
  const { obterRevisoesHoje, obterRevisoesAtrasadas, marcarRevisaoConcluida, categorias } = useEstudos();
  const [activeTab, setActiveTab] = useState('hoje');
  
  const revisoesHoje = obterRevisoesHoje();
  const revisoesAtrasadas = obterRevisoesAtrasadas();
  
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
              <p className="text-sm text-gray-600">Revise os temas em intervalos específicos para melhor retenção</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center text-green-800 mb-1">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mr-2">D+1</Badge>
                <span className="font-medium">Revisão de 1 dia</span>
              </div>
              <p className="text-xs text-gray-600">Revisão realizada 1 dia após o estudo inicial</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-800 mb-1">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mr-2">D+7</Badge>
                <span className="font-medium">Revisão de 7 dias</span>
              </div>
              <p className="text-xs text-gray-600">Revisão realizada 7 dias após o estudo inicial</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div className="flex items-center text-purple-800 mb-1">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 mr-2">D+30</Badge>
                <span className="font-medium">Revisão de 30 dias</span>
              </div>
              <p className="text-xs text-gray-600">Revisão realizada 30 dias após o estudo inicial</p>
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
              apenasHoje.map((revisao) => (
                <Card key={revisao.revisaoId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id={`revisao-${revisao.revisaoId}`}
                        checked={false}
                        onCheckedChange={(checked) => {
                          marcarRevisaoConcluida(revisao.temaId, revisao.revisaoId, checked as boolean);
                        }}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <label 
                              htmlFor={`revisao-${revisao.revisaoId}`}
                              className="font-medium cursor-pointer text-estudo-text"
                            >
                              {revisao.titulo}
                            </label>
                            
                            <div className="text-sm text-gray-500 mt-1">
                              {getNomeCategoria(revisao.categoria)}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {getTipoRevisaoBadge(revisao.tipo)}
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>{getTipoRevisaoTexto(revisao.tipo)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
              apenasAtrasadas.map((revisao) => (
                <Card key={revisao.revisaoId} className="hover:shadow-md transition-shadow bg-red-50 border-red-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id={`revisao-atrasada-${revisao.revisaoId}`}
                        checked={false}
                        onCheckedChange={(checked) => {
                          marcarRevisaoConcluida(revisao.temaId, revisao.revisaoId, checked as boolean);
                        }}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <label 
                              htmlFor={`revisao-atrasada-${revisao.revisaoId}`}
                              className="font-medium cursor-pointer text-estudo-text"
                            >
                              {revisao.titulo}
                            </label>
                            
                            <div className="text-sm text-gray-500 mt-1">
                              {getNomeCategoria(revisao.categoria)}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {getTipoRevisaoBadge(revisao.tipo)}
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                              <Clock size={12} className="mr-1" /> Atrasada
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>{getTipoRevisaoTexto(revisao.tipo)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
              revisoesHoje.map((revisao) => (
                <Card 
                  key={revisao.revisaoId} 
                  className={`hover:shadow-md transition-shadow ${revisao.atrasada ? 'bg-red-50 border-red-100' : 'bg-white'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id={`revisao-todas-${revisao.revisaoId}`}
                        checked={false}
                        onCheckedChange={(checked) => {
                          marcarRevisaoConcluida(revisao.temaId, revisao.revisaoId, checked as boolean);
                        }}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <label 
                              htmlFor={`revisao-todas-${revisao.revisaoId}`}
                              className="font-medium cursor-pointer text-estudo-text"
                            >
                              {revisao.titulo}
                            </label>
                            
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
                            <span>{getTipoRevisaoTexto(revisao.tipo)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
