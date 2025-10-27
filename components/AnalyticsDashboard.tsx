import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    gasto: number;
    consumo: number;
}

interface AnalyticsDashboardProps {
    data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-900/90 border border-gray-700 rounded-lg shadow-lg text-sm">
        <p className="label font-bold text-white">{`${label}`}</p>
        <p className="text-pink-400">{`Gasto : R$ ${payload[0].value.toFixed(2)}`}</p>
        <p className="text-cyan-400">{`Consumo : ${payload[1] ? payload[1].value.toFixed(1) + ' km/L' : 'N/A'}`}</p>
      </div>
    );
  }
  return null;
};


export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
    if (data.length < 2) {
        return (
            <div className="text-center text-gray-500 py-8 px-4 bg-[var(--theme-card-bg)] rounded-xl">
                <h3 className="text-lg font-semibold text-white">Dados insuficientes para os gráficos.</h3>
                <p className="mt-2">Continue adicionando abastecimentos de meses diferentes para gerar a análise.</p>
            </div>
        )
    }

    return (
        <div className="bg-[var(--theme-card-bg)] text-white p-4 sm:p-6 rounded-2xl shadow-lg space-y-8">
            <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Gasto Mensal (R$)</h4>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R$${value}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "14px"}} />
                        <Line type="monotone" dataKey="gasto" stroke="#f472b6" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Consumo Médio Mensal (km/L)</h4>
                 <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12}/>
                        <YAxis stroke="#9ca3af" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(value) => `${value}`}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "14px"}} />
                        <Line type="monotone" dataKey="consumo" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
