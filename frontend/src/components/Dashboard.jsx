import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

const CORES = ['#4ade80', '#facc15', '#f97316', '#ef4444'];

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [criticos, setCriticos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/resumo').then(r => r.json()).then(setResumo);
    fetch('http://localhost:8000/criticos').then(r => r.json()).then(setCriticos);
  }, []);

  if (!resumo) return <p style={{color:'#888'}}>Carregando...</p>;

  const niveis = [
    { name: 'Nível 1', value: criticos.filter(t => t.nivel_20 === 1).length },
    { name: 'Nível 2', value: criticos.filter(t => t.nivel_20 === 2).length },
    { name: 'Nível 3', value: criticos.filter(t => t.nivel_20 === 3).length },
  ].filter(n => n.value > 0);

  const tendencia = [
    { mes: 'Jan', ndvi: 0.52 },
    { mes: 'Fev', ndvi: 0.55 },
    { mes: 'Mar/13', ndvi: 0.58 },
    { mes: 'Mar/20', ndvi: 0.61 },
  ];

  return (
    <div>
      <h1 style={{marginBottom: 8, fontSize: 24}}>Sistema de Monitoramento de Vegetação</h1>
      <p style={{color:'#666', marginBottom: 32}}>Rodoanel Mário Covas — Análise via dados reais + IA</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32}}>
        {[
          { label: 'Extensão Total', value: '29,3 km', cor: '#4ade80' },
          { label: 'Trechos Monitorados', value: resumo.total_trechos, cor: '#60a5fa' },
          { label: 'Trechos Críticos', value: resumo.criticos, cor: '#ef4444' },
          { label: 'Com Crescimento', value: resumo.com_crescimento, cor: '#facc15' },
        ].map((c, i) => (
          <div key={i} style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 8px #0001', borderTop:`4px solid ${c.cor}`}}>
            <p style={{color:'#888', fontSize:13, marginBottom:8}}>{c.label}</p>
            <p style={{fontSize:32, fontWeight:700, color:c.cor}}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 8px #0001'}}>
          <h3 style={{marginBottom:16}}>Distribuição por Nível</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={niveis} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name, value}) => `${name}: ${value}`}>
                {niveis.map((_, i) => <Cell key={i} fill={CORES[i+1]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 8px #0001'}}>
          <h3 style={{marginBottom:16}}>Tendência de Crescimento</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={tendencia}>
              <XAxis dataKey="mes" />
              <YAxis domain={[0.4, 0.8]} />
              <Tooltip />
              <Area type="monotone" dataKey="ndvi" stroke="#4ade80" fill="#4ade8033" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}