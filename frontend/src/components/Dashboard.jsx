import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [criticos, setCriticos] = useState([]);
  const [conformidade, setConformidade] = useState(null);
  const [ordens, setOrdens] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/resumo').then(r => r.json()).then(setResumo);
    fetch('http://localhost:8000/criticos').then(r => r.json()).then(setCriticos);
    fetch('http://localhost:8000/conformidade').then(r => r.json()).then(setConformidade);
    fetch('http://localhost:8000/ordens').then(r => r.json()).then(setOrdens);
  }, []);

  if (!resumo || !conformidade) return <Loading />;

  const urgentes = ordens.filter(o => o.prioridade === 'URGENTE').length;
  const altas = ordens.filter(o => o.prioridade === 'ALTA').length;

  const dadosPorArea = Object.entries(
    criticos.reduce((acc, t) => {
      acc[t.area] = (acc[t.area] || 0) + 1;
      return acc;
    }, {})
  ).map(([area, total]) => ({
    area: area.replace('Canteiro ', '').replace(' Externa', ' Ext.').replace(' Interna', ' Int.'),
    total
  })).sort((a, b) => b.total - a.total);

  const tendencia = [
    { mes: 'Jan', nivel: 1.18 },
    { mes: 'Fev', nivel: 1.22 },
    { mes: 'Mar/13', nivel: 1.29 },
    { mes: 'Mar/20', nivel: 1.33 },
  ];

  const top5 = criticos
    .filter(t => t.nivel_20 === 3)
    .slice(0, 5);

  const corNivel = { 1: '#16a34a', 2: '#ca8a04', 3: '#ef4444' };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <h1 className="page-title">Dashboard</h1>
        <span style={{fontSize:12, color:'#aaa'}}>
          Última atualização: 20/03/2026 · Rodoanel Mário Covas
        </span>
      </div>

      {/* Cards métricas */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24}}>
        {[
          { icon:'🛣️', label:'Extensão', value:'29,3 km', sub:'Rodoanel Mário Covas', cor:'#5B0FBE', bg:'#f5f0ff' },
          { icon:'📍', label:'Monitorados', value: resumo.total_trechos, sub:'Pontos de controle', cor:'#1a1a2e', bg:'#f5f5f7' },
          { icon:'⚠️', label:'Críticos', value: resumo.criticos, sub:'Requerem intervenção', cor:'#ef4444', bg:'#fef2f2' },
          { icon:'📈', label:'Crescendo', value: resumo.com_crescimento, sub:'Vegetação aumentando', cor:'#ca8a04', bg:'#fefce8' },
          { icon:'✅', label:'Conformidade', value:`${conformidade.conformidade_geral}%`, sub:'ARTESP / ANTT', cor:'#16a34a', bg:'#f0fdf4' },
        ].map((c, i) => (
          <div key={i} style={{
            background: c.bg, borderRadius:14, padding:'18px 20px',
            border:`1px solid ${c.cor}22`
          }}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <p style={{color:'#888', fontSize:12, fontWeight:500}}>{c.label}</p>
            </div>
            <p style={{fontSize:30, fontWeight:800, color:c.cor, lineHeight:1}}>{c.value}</p>
            <p style={{color:'#bbb', fontSize:11, marginTop:6}}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráficos linha + barra */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24}}>
        <div className="card">
          <h3 style={{fontSize:14, fontWeight:700, marginBottom:16}}>Evolução do Nível Médio de Vegetação</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tendencia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{fontSize:12}} />
              <YAxis domain={[1, 2]} tick={{fontSize:12}} />
              <Tooltip />
              <Line type="monotone" dataKey="nivel" stroke="#5B0FBE" strokeWidth={2.5} dot={{fill:'#5B0FBE', r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{fontSize:14, fontWeight:700, marginBottom:16}}>Trechos Críticos por Área</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosPorArea} layout="vertical">
              <XAxis type="number" tick={{fontSize:11}} />
              <YAxis type="category" dataKey="area" tick={{fontSize:11}} width={110} />
              <Tooltip />
              <Bar dataKey="total" radius={[0,6,6,0]}>
                {dadosPorArea.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#ef4444' : i === 1 ? '#f97316' : '#5B0FBE'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela ordens urgentes + trechos nivel 3 */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:14}}>
            <h3 style={{fontSize:14, fontWeight:700}}>Ordens Urgentes</h3>
            <span style={{
              background:'#fef2f2', color:'#ef4444',
              padding:'2px 8px', borderRadius:6,
              fontSize:12, fontWeight:700
            }}>
              {urgentes} urgentes · {altas} altas
            </span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr auto auto auto', gap:'8px 16px', alignItems:'center'}}>
            <p style={{fontSize:11, color:'#aaa', fontWeight:600}}>TRECHO</p>
            <p style={{fontSize:11, color:'#aaa', fontWeight:600}}>MÉTODO</p>
            <p style={{fontSize:11, color:'#aaa', fontWeight:600}}>EQUIPES</p>
            <p style={{fontSize:11, color:'#aaa', fontWeight:600}}>PRAZO</p>
            {ordens.slice(0,5).map((o, i) => (
              <React.Fragment key={i}>
                <p style={{fontSize:13, fontWeight:600, color:'#1a1a2e'}}>
                  KM {(o.km/1000).toFixed(1).replace('.','+')}</p>
                <p style={{fontSize:12, color:'#666'}}>{o.metodo.replace('Roçada ','')}</p>
                <p style={{fontSize:12, color:'#666', textAlign:'center'}}>{o.equipes_necessarias}</p>
                <span style={{
                  background: o.prioridade === 'URGENTE' ? '#ef4444' : '#f97316',
                  color:'#fff', padding:'2px 8px', borderRadius:5,
                  fontSize:11, fontWeight:700, textAlign:'center'
                }}>
                  {o.prazo}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:14}}>
            <h3 style={{fontSize:14, fontWeight:700}}>Trechos Nível 3 — Crítico</h3>
            <span style={{
              background:'#fef2f2', color:'#ef4444',
              padding:'2px 8px', borderRadius:6,
              fontSize:12, fontWeight:700
            }}>
              {criticos.filter(t => t.nivel_20 === 3).length} trechos
            </span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr auto auto', gap:'8px 16px', alignItems:'center'}}>
            <p style={{fontSize:11, color:'#aaa', fontWeight:600}}>TRECHO</p>
            <p style={{fontSize:11, color:'#aaa', fontWeight:600}}>ÁREA</p>
            <p style={{fontSize:11, color:'#aaa', fontWeight:600}}>CRESCIMENTO</p>
            {criticos.filter(t => t.nivel_20 === 3).slice(0,5).map((t, i) => (
              <React.Fragment key={i}>
                <p style={{fontSize:13, fontWeight:600, color:'#1a1a2e'}}>
                  KM {(t.km/1000).toFixed(1).replace('.','+')}</p>
                <p style={{fontSize:12, color:'#666'}}>
                  {t.area.replace('Canteiro ','').replace(' Externa',' Ext.').replace(' Interna',' Int.')}
                </p>
                <span style={{
                  background: t.crescimento > 0 ? '#fef2f2' : '#f0fdf4',
                  color: t.crescimento > 0 ? '#ef4444' : '#16a34a',
                  padding:'2px 8px', borderRadius:5,
                  fontSize:11, fontWeight:700, textAlign:'center'
                }}>
                  {t.crescimento > 0 ? `+${t.crescimento}` : t.crescimento === 0 ? 'Estável' : t.crescimento}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}