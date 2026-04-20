import React, { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Ordens() {
  const [ordens, setOrdens] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    fetch('http://localhost:8000/ordens').then(r => r.json()).then(setOrdens);
  }, []);

  if (!ordens.length) return <Loading />;

  const filtradas = filtro === 'TODOS' ? ordens : ordens.filter(o => o.prioridade === filtro);

  const exportarCSV = () => {
    const headers = ['KM','Area','Nivel Atual','Prioridade','Prazo','Metodo','Equipes','EPI'];
    const rows = filtradas.map(o => [
      o.observacao, o.area, o.nivel_atual, o.prioridade,
      o.prazo, o.metodo, o.equipes_necessarias, o.epi
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordens_servico_vegetrack.csv';
    a.click();
  };

  const ESTILOS = {
    'URGENTE': { bg: '#fef2f2', border: '#ef4444', badgeBg: '#ef4444', badgeColor: '#fff' },
    'ALTA':    { bg: '#fff7ed', border: '#f97316', badgeBg: '#f97316', badgeColor: '#fff' },
    'MEDIA':   { bg: '#fefce8', border: '#ca8a04', badgeBg: '#fefce8', badgeColor: '#854d0e' },
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Ordens de Serviço</h1>
        <p className="page-subtitle">Geradas automaticamente com base nos dados reais</p>
      </div>

      <div className="filter-bar">
        {['TODOS','URGENTE','ALTA','MEDIA'].map(f => (
          <button key={f} className={`filter-btn ${filtro === f ? 'ativo' : ''}`}
            onClick={() => setFiltro(f)}>
            {f === 'TODOS' ? 'Todas' : f}
          </button>
        ))}
        <span className="count-label">{filtradas.length} ordens</span>
        <button className="btn-primary" onClick={exportarCSV} style={{marginLeft:'auto'}}>
          ⬇ Exportar CSV
        </button>
      </div>

      <div style={{display:'grid', gap:12}}>
        {filtradas.map((o, i) => {
          const e = ESTILOS[o.prioridade];
          return (
            <div key={i} style={{
              background: e.bg,
              borderRadius:12,
              padding:'20px 24px',
              boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
              borderLeft:`4px solid ${e.border}`
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
                <div>
                  <p style={{fontWeight:700, fontSize:16}}>{o.observacao}</p>
                  <p style={{color:'#888', fontSize:13, marginTop:3}}>{o.area}</p>
                </div>
                <span style={{
                  background: e.badgeBg, color: e.badgeColor,
                  padding:'5px 14px', borderRadius:8,
                  fontSize:12, fontWeight:700,
                  border: o.prioridade === 'MEDIA' ? '1.5px solid #ca8a04' : 'none'
                }}>
                  {o.prioridade}
                </span>
              </div>

              <div style={{display:'flex', gap:32, marginBottom:12, flexWrap:'wrap'}}>
                <div>
                  <p style={{fontSize:11, color:'#888', marginBottom:2}}>⏱ Prazo</p>
                  <p style={{fontWeight:700, fontSize:14, color:'#1a1a2e'}}>{o.prazo}</p>
                </div>
                <div>
                  <p style={{fontSize:11, color:'#888', marginBottom:2}}>🌿 Método</p>
                  <p style={{fontWeight:700, fontSize:14, color:'#1a1a2e'}}>{o.metodo}</p>
                </div>
                <div>
                  <p style={{fontSize:11, color:'#888', marginBottom:2}}>👷 Equipes</p>
                  <p style={{fontWeight:700, fontSize:14, color:'#1a1a2e'}}>{o.equipes_necessarias} equipe(s)</p>
                </div>
              </div>

              <div style={{borderTop:`1px solid ${e.border}22`, paddingTop:12}}>
                <p style={{fontSize:11, color:'#888', marginBottom:4}}>🦺 EPI Obrigatório</p>
                <p style={{fontSize:13, fontWeight:500, color:'#333'}}>{o.epi}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}