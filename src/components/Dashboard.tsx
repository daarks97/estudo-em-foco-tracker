
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
    { name: 'Concluídos', value: temasConcluidos, color: '#34C759' }, // Apple green
    { name: 'Em andamento', value: temasEmAndamento, color: '#007AFF' } // Apple blue
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
    <div className="bg-white rounded-2xl shadow-apple p-6 animate-scale-in">
      <h2 className="text-xl font-medium mb-6 text-estudo-text">Resumo de Estudos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-estudo-light rounded-2xl p-5 text-center transition-transform hover:scale-[1.02] duration-200">
          <h3 className="text-sm font-medium text-estudo-primary mb-2">Progresso Geral</h3>
          <div className="text-3xl font-semibold text-estudo-primary">{progresso}%</div>
        </div>
        
        <div className="bg-estudo-light rounded-2xl p-5 text-center transition-transform hover:scale-[1.02] duration-200">
          <h3 className="text-sm font-medium text-estudo-primary mb-2">Temas Concluídos</h3>
          <div className="text-3xl font-semibold text-estudo-primary">
            {temasConcluidos} <span className="text-sm text-estudo-gray">/ {totalTemas}</span>
          </div>
        </div>
        
        <div className="bg-[#FFF5EB] rounded-2xl p-5 text-center transition-transform hover:scale-[1.02] duration-200">
          <h3 className="text-sm font-medium text-[#FF9500] mb-2">Temas Atrasados</h3>
          <div className="text-3xl font-semibold text-[#FF9500]">{temasAtrasados}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium mb-4 text-estudo-text">Temas por Prioridade</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Alta</span>
                <span className="text-sm font-medium">{temasPrioridadeAlta}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#FF3B30] h-2 rounded-full" style={{ width: `${(temasPrioridadeAlta / totalTemas) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Média</span>
                <span className="text-sm font-medium">{temasPrioridadeMedia}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#FF9500] h-2 rounded-full" style={{ width: `${(temasPrioridadeMedia / totalTemas) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Baixa</span>
                <span className="text-sm font-medium">{temasPrioridadeBaixa}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#007AFF] h-2 rounded-full" style={{ width: `${(temasPrioridadeBaixa / totalTemas) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-4 text-estudo-text">Status dos Estudos</h3>
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
