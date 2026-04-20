import React, { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Criticos() {
  const [criticos, setCriticos] = useState([]);
  const [filtroNivel, setFiltroNivel] = useState('TODOS');
  const [filtroArea, setFiltroArea] = useState('TODAS');

  useEffect(() => {
    fetch('http://localhost:8000/criticos').then(r => r.json()).then(setCriticos);
  }, []);

  if (!criticos.length) return <Loading />;

  const areas = ['TODAS', ...new Set(criticos.map(t => t.area))];

  const filtrados = criticos
    .filter(t => filtroNivel === 'TODOS' || t.nivel_20 === parseInt(filtroNivel))
    .filter(t => filtroArea === 'TODAS' || t.area === filtroArea);

  const corNivel = { 1: '#16a34a', 2: '#ca8a04', 3: '#ef4444' };
  const bgNivel  = { 1: '#f0fdf4', 2: '#fefce8', 3: '#fef2f2' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Trechos Críticos</h1>
        <p className="page-subtitle">Trechos que requerem intervenção imediata</p>
      </div>

      <div className="filter-bar">
        {['TODOS', '2', '3'].map(f => (
          <button key={f} className={`filter-btn ${filtroNivel === f ? 'ativo' : ''}`}
            onClick={() => setFiltroNivel(f)}>
            {f === 'TODOS' ? 'Todos os níveis' : `Nível ${f}`}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        {areas.map(a => (
          <button key={a} className={`filter-btn ${filtroArea === a ? 'ativo' : ''}`}
            onClick={() => setFiltroArea(a)}>
            {a === 'TODAS' ? 'Todas as áreas' : a}
          </button>
        ))}
        <span className="count-label">{filtrados.length} trechos encontrados</span>
      </div>

      <div style={{display:'grid', gap:12}}>
        {filtrados.map((t, i) => (
          <div key={i} style={{
            background:'#fff', borderRadius:12, padding:20,
            boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
            borderLeft:`4px solid ${corNivel[t.nivel_20]}`
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <p style={{fontWeight:700, fontSize:16}}>
                  KM {(t.km/1000).toFixed(1).replace('.','+')}</p>
                <p style={{color:'#888', fontSize:13, marginTop:3}}>{t.area}</p>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                {t.crescimento > 0 && (
                  <span className="crescendo">↑ Crescendo</span>
                )}
                <span style={{
                  background: bgNivel[t.nivel_20],
                  color: corNivel[t.nivel_20],
                  padding:'4px 12px', borderRadius:6,
                  fontSize:13, fontWeight:700
                }}>
                  Nível {t.nivel_20}
                </span>
              </div>
            </div>
            <div style={{display:'flex', gap:24, marginTop:12, fontSize:13, color:'#888'}}>
              <span>Nível anterior: <b style={{color:'#333'}}>{t.nivel_13}</b></span>
              <span>Crescimento:
                <b style={{color: t.crescimento > 0 ? '#ef4444' : '#16a34a', marginLeft:4}}>
                  {t.crescimento > 0 ? '+'+t.crescimento : t.crescimento}
                </b>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}