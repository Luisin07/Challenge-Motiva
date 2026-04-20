import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

const CORES = ['#ca8a04', '#ef4444'];

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [criticos, setCriticos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/resumo').then(r => r.json()).then(setResumo);
    fetch('http://localhost:8000/criticos').then(r => r.json()).then(setCriticos);
  }, []);

  if (!resumo) return <Loading />;

  const niveis = [
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
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Monitoramento de vegetação — Rodoanel Mário Covas · Dados reais + IA</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32}}>
        {[
          { label: 'Extensão Total', value: '29,3 km', cor: '#6B21FF', bg: '#f5f0ff' },
          { label: 'Trechos Monitorados', value: resumo.total_trechos, cor: '#1a1a2e', bg: '#f5f5f7' },
          { label: 'Trechos Críticos', value: resumo.criticos, cor: '#ef4444', bg: '#fef2f2' },
          { label: 'Com Crescimento', value: resumo.com_crescimento, cor: '#ca8a04', bg: '#fefce8' },
        ].map((c, i) => (
          <div key={i} style={{
            background: c.bg, borderRadius:16, padding:24,
            border:`1px solid ${c.cor}22`
          }}>
            <p style={{color:'#888', fontSize:13, marginBottom:12, fontWeight:500}}>{c.label}</p>
            <p style={{fontSize:36, fontWeight:800, color:c.cor}}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div className="card">
          <h3 style={{marginBottom:16, fontWeight:700, fontSize:15}}>Distribuição por Nível</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={niveis} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name, value}) => `${name}: ${value}`}>
                {niveis.map((_, i) => <Cell key={i} fill={CORES[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{marginBottom:16, fontWeight:700, fontSize:15}}>Tendência de Crescimento</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={tendencia}>
              <XAxis dataKey="mes" tick={{fontSize:12}} />
              <YAxis domain={[0.4, 0.8]} tick={{fontSize:12}} />
              <Tooltip />
              <Area type="monotone" dataKey="ndvi" stroke="#6B21FF" fill="#6B21FF22" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}