import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Dashboard({ setPagina, navegarParaTrecho, navegarParaOrdem }) {
  const [resumo, setResumo] = useState(null);
  const [criticos, setCriticos] = useState([]);
  const [conformidade, setConformidade] = useState(null);
  const [ordens, setOrdens] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [filtroMapa, setFiltroMapa] = useState('TODOS');

  useEffect(() => {
    fetch('http://localhost:8000/resumo').then(r => r.json()).then(setResumo);
    fetch('http://localhost:8000/criticos').then(r => r.json()).then(setCriticos);
    fetch('http://localhost:8000/conformidade').then(r => r.json()).then(setConformidade);
    fetch('http://localhost:8000/ordens').then(r => r.json()).then(setOrdens);
    fetch('http://localhost:8000/mapa/pontos').then(r => r.json()).then(setPontos);
  }, []);

  if (!resumo || !conformidade) return <Loading />;

  const urgentes = ordens.filter(o => o.prioridade === 'URGENTE').length;

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

  // Distribui níveis pelos pontos baseado na proporção real dos dados
  const totalCriticos = criticos.filter(c => c.nivel_20 === 3).length;
  const totalModerado = criticos.filter(c => c.nivel_20 === 2).length;
  const totalNormal = criticos.filter(c => c.nivel_20 === 1).length;
  const total = totalCriticos + totalModerado + totalNormal;

  const amostra = pontos.filter((_, i) => i % 6 === 0);

  const pontosComNivel = amostra.map((p, i) => {
    const proporcao = i / amostra.length;
    let nivel = 1;
    if (proporcao < totalCriticos / total) nivel = 3;
    else if (proporcao < (totalCriticos + totalModerado) / total) nivel = 2;
    return { ...p, nivel };
  });

  const pontosFiltrados = filtroMapa === 'TODOS'
    ? pontosComNivel
    : filtroMapa === 'CRITICO'
    ? pontosComNivel.filter(p => p.nivel === 3)
    : filtroMapa === 'MODERADO'
    ? pontosComNivel.filter(p => p.nivel === 2)
    : pontosComNivel.filter(p => p.nivel === 1);

  const corNivel = (nivel) => {
    if (nivel === 3) return '#ef4444';
    if (nivel === 2) return '#ca8a04';
    return '#16a34a';
  };

  const labelNivel = (nivel) => {
    if (nivel === 3) return '🚨 Nível 3 — Crítico';
    if (nivel === 2) return '⚠️ Nível 2 — Moderado';
    return '✅ Nível 1 — Normal';
  };

  const FILTROS = [
    { id: 'TODOS', label: 'Todos', cor: '#5B0FBE' },
    { id: 'CRITICO', label: 'Crítico', cor: '#ef4444' },
    { id: 'MODERADO', label: 'Moderado', cor: '#ca8a04' },
    { id: 'NORMAL', label: 'Normal', cor: '#16a34a' },
  ];

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <h1 className="page-title">Dashboard</h1>
        <span style={{fontSize:12, color:'#aaa'}}>Última atualização: 20/03/2026 · Rodoanel Mário Covas</span>
      </div>

      {/* Cards métricas */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24}}>
        {[
          { icon:'🛣️', label:'Extensão', value:'29,3 km', sub:'Rodoanel Mário Covas', cor:'#5B0FBE', bg:'#f5f0ff', pagina: null },
          { icon:'📍', label:'Monitorados', value: resumo.total_trechos, sub:'Pontos de controle', cor:'#1a1a2e', bg:'#f5f5f7', pagina: 'criticos' },
          { icon:'⚠️', label:'Críticos', value: resumo.criticos, sub:'Requerem intervenção', cor:'#ef4444', bg:'#fef2f2', pagina: 'criticos' },
          { icon:'📈', label:'Crescendo', value: resumo.com_crescimento, sub:'Vegetação aumentando', cor:'#ca8a04', bg:'#fefce8', pagina: 'criticos' },
          { icon:'✅', label:'Conformidade', value:`${conformidade.conformidade_geral}%`, sub:'ARTESP / ANTT', cor:'#16a34a', bg:'#f0fdf4', pagina: 'conformidade' },
        ].map((c, i) => (
          <div key={i}
            onClick={() => c.pagina && setPagina(c.pagina)}
            style={{
              background: c.bg, borderRadius:14, padding:'18px 20px',
              border:`1px solid ${c.cor}22`,
              cursor: c.pagina ? 'pointer' : 'default',
              transition:'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={e => { if(c.pagina) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <p style={{color:'#888', fontSize:12, fontWeight:500}}>{c.label}</p>
            </div>
            <p style={{fontSize:30, fontWeight:800, color:c.cor, lineHeight:1}}>{c.value}</p>
            <p style={{color:'#bbb', fontSize:11, marginTop:6}}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Mapa + Urgentes */}
      <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20, marginBottom:24}}>
        <div className="card" style={{padding:0, overflow:'hidden'}}>
          <div style={{padding:'14px 20px', borderBottom:'1px solid #f0f0f0'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <div>
                <h3 style={{fontSize:15, fontWeight:700}}>Mapa do Rodoanel Mário Covas</h3>
                <p style={{fontSize:11, color:'#aaa', marginTop:2}}>Clique nos pontos para detalhes</p>
              </div>
              <div style={{display:'flex', gap:6}}>
                {FILTROS.map(f => (
                  <button key={f.id}
                    onClick={() => setFiltroMapa(f.id)}
                    style={{
                      padding:'5px 12px', borderRadius:20, border:'none',
                      fontSize:11, fontWeight:600, cursor:'pointer',
                      background: filtroMapa === f.id ? f.cor : '#f0f0f0',
                      color: filtroMapa === f.id ? '#fff' : '#666',
                      transition:'all 0.15s'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <MapContainer
  center={[-23.52, -46.78]}
  zoom={11}
  style={{height:'380px', width:'100%', zIndex:0}}
  scrollWheelZoom={false}
>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CartoDB'
            />
            {pontosFiltrados.map((p, i) => (
              <CircleMarker
                key={i}
                center={[p.lat, p.lng]}
                radius={p.nivel === 3 ? 9 : p.nivel === 2 ? 7 : 5}
                pathOptions={{
                  color: corNivel(p.nivel),
                  fillColor: corNivel(p.nivel),
                  fillOpacity: filtroMapa === 'TODOS' ? 0.7 : 0.95,
                  weight: filtroMapa === 'TODOS' ? 1 : 2
                }}
              >
                <Popup>
  <div style={{minWidth:180, fontFamily:'Inter, sans-serif'}}>
    <p style={{fontWeight:700, fontSize:14, margin:'0 0 4px', color:'#1a1a2e'}}>
      {labelNivel(p.nivel)}
    </p>
    <p style={{fontSize:11, color:'#888', margin:'0 0 12px'}}>
      Clique para ver os trechos filtrados
    </p>
    <div style={{display:'flex', flexDirection:'column', gap:6}}>
      <button onClick={() => navegarParaTrecho(p.nivel, null)} style={{
        background:'#5B0FBE', color:'#fff', border:'none',
        padding:'7px 10px', borderRadius:6, fontSize:11,
        fontWeight:600, cursor:'pointer', width:'100%'
      }}>
        🗂 Ver todos de nível {p.nivel}
      </button>
      {p.nivel >= 2 && (
  <button onClick={() => navegarParaOrdem(p.nivel)} style={{
    background: p.nivel === 3 ? '#ef4444' : '#ca8a04',
    color:'#fff', border:'none',
    padding:'7px 10px', borderRadius:6, fontSize:11,
    fontWeight:600, cursor:'pointer', width:'100%'
  }}>
    📋 Ver ordens de serviço
  </button>
)}
    </div>
  </div>
</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:14}}>
            <h3 style={{fontSize:14, fontWeight:700}}>Intervenções Urgentes</h3>
            <span style={{background:'#fef2f2', color:'#ef4444', padding:'2px 8px', borderRadius:6, fontSize:12, fontWeight:700}}>
              {urgentes} urgentes
            </span>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {ordens.slice(0,6).map((o, i) => (
              <div key={i}
                onClick={() => setPagina('ordens')}
                style={{
                  background: o.prioridade === 'URGENTE' ? '#fef2f2' : '#fff7ed',
                  borderRadius:10, padding:'12px 14px',
                  borderLeft:`3px solid ${o.prioridade === 'URGENTE' ? '#ef4444' : '#f97316'}`,
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  cursor:'pointer', transition:'transform 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}
              >
                <div>
                  <p style={{fontWeight:700, fontSize:13}}>KM {(o.km/1000).toFixed(1).replace('.','+')}</p>
                  <p style={{fontSize:11, color:'#888', marginTop:2}}>{o.area?.replace('Canteiro ','')}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{
                    background: o.prioridade === 'URGENTE' ? '#ef4444' : '#f97316',
                    color:'#fff', padding:'3px 8px', borderRadius:5,
                    fontSize:11, fontWeight:700, display:'block', marginBottom:3
                  }}>
                    {o.prazo}
                  </span>
                  <p style={{fontSize:10, color:'#aaa'}}>{o.equipes_necessarias} equipe(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div className="card">
          <h3 style={{fontSize:14, fontWeight:700, marginBottom:16}}>Evolução do Nível Médio</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={tendencia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{fontSize:11}} />
              <YAxis domain={[1, 2]} tick={{fontSize:11}} />
              <Tooltip />
              <Line type="monotone" dataKey="nivel" stroke="#5B0FBE" strokeWidth={2.5} dot={{fill:'#5B0FBE', r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{fontSize:14, fontWeight:700, marginBottom:16}}>Críticos por Área</h3>
          <ResponsiveContainer width="100%" height={180}>
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
    </div>
  );
}