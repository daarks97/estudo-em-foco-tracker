
import React from 'react';
import { useEstudos } from '@/contexts/EstudosContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { temas } = useEstudos();
  
  // Cálculos para métricas
  const totalTemas = temas.length;
  const temasConcluidos = temas.filter(tema => tema.concluido).length;
  const temasEmAndamento = totalTemas - temasConcluidos;
  const progresso = totalTemas > 0 ? Math.round((temasConcluidos / totalTemas) * 100) : 0;
  
  // Dados para o gráfico de pizza
  const data = [
    { name: 'Concluídos', value: temasConcluidos, color: '#10B981' },
    { name: 'Em andamento', value: temasEmAndamento, color: '#9b87f5' }
  ];

  // Verificar temas atrasados (data limite no passado e não concluídos)
  const hoje = new Date();
  const temasAtrasados = temas.filter(
    tema => tema.dataLimite && tema.dataLimite < hoje && !tema.concluido
  ).length;

  // Calcular temas por prioridade
  const temasPrioridadeAlta = temas.filter(tema => tema.prioridade === 'alta' && !tema.concluido).length;
  const temasPrioridadeMedia = temas.filter(tema => tema.prioridade === 'media' && !tema.concluido).length;
  const temasPrioridadeBaixa = temas.filter(tema => tema.prioridade === 'baixa' && !tema.concluido).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-estudo-text">Resumo de Estudos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-estudo-light rounded-lg p-4 text-center">
          <h3 className="text-sm text-estudo-secondary font-medium">Progresso Geral</h3>
          <div className="text-3xl font-bold text-estudo-primary mt-2">{progresso}%</div>
        </div>
        
        <div className="bg-estudo-light rounded-lg p-4 text-center">
          <h3 className="text-sm text-estudo-secondary font-medium">Temas Concluídos</h3>
          <div className="text-3xl font-bold text-estudo-primary mt-2">
            {temasConcluidos} <span className="text-sm text-estudo-secondary">/ {totalTemas}</span>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <h3 className="text-sm text-amber-700 font-medium">Temas Atrasados</h3>
          <div className="text-3xl font-bold text-amber-600 mt-2">{temasAtrasados}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-semibold mb-2 text-estudo-text">Temas por Prioridade</h3>
          <div className="bg-estudo-background p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Alta</span>
              <span className="text-sm font-medium">{temasPrioridadeAlta}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(temasPrioridadeAlta / totalTemas) * 100}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-2 mt-4">
              <span className="text-sm">Média</span>
              <span className="text-sm font-medium">{temasPrioridadeMedia}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(temasPrioridadeMedia / totalTemas) * 100}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-2 mt-4">
              <span className="text-sm">Baixa</span>
              <span className="text-sm font-medium">{temasPrioridadeBaixa}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(temasPrioridadeBaixa / totalTemas) * 100}%` }}></div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-semibold mb-2 text-estudo-text">Status dos Estudos</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
