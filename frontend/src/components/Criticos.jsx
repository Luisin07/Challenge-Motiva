import React, { useEffect, useState } from 'react';

const CORES_NIVEL = { 1: '#4ade80', 2: '#facc15', 3: '#ef4444' };

export default function Criticos() {
  const [criticos, setCriticos] = useState([]);
  const [filtroNivel, setFiltroNivel] = useState('TODOS');
  const [filtroArea, setFiltroArea] = useState('TODAS');

  useEffect(() => {
    fetch('http://localhost:8000/criticos').then(r => r.json()).then(setCriticos);
  }, []);

  const areas = ['TODAS', ...new Set(criticos.map(t => t.area))];

  const filtrados = criticos
    .filter(t => filtroNivel === 'TODOS' || t.nivel_20 === parseInt(filtroNivel))
    .filter(t => filtroArea === 'TODAS' || t.area === filtroArea);

  return (
    <div>
      <h1 style={{marginBottom: 8, fontSize: 24}}>Trechos Críticos</h1>
      <p style={{color:'#666', marginBottom: 24}}>Trechos que requerem intervenção imediata</p>

      <div style={{display:'flex', gap:8, marginBottom:12, flexWrap:'wrap'}}>
        {['TODOS', '2', '3'].map(f => (
          <button key={f} onClick={() => setFiltroNivel(f)} style={{
            padding:'8px 20px', borderRadius:8, border:'none', cursor:'pointer',
            background: filtroNivel === f ? '#1a1a2e' : '#fff',
            color: filtroNivel === f ? '#4ade80' : '#333',
            fontWeight: filtroNivel === f ? 700 : 400,
            boxShadow:'0 2px 6px #0001'
          }}>
            {f === 'TODOS' ? 'Todos os níveis' : `Nível ${f}`}
          </button>
        ))}
      </div>

      <div style={{display:'flex', gap:8, marginBottom:24, flexWrap:'wrap'}}>
        {areas.map(a => (
          <button key={a} onClick={() => setFiltroArea(a)} style={{
            padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer',
            background: filtroArea === a ? '#1a1a2e' : '#f0f0f0',
            color: filtroArea === a ? '#4ade80' : '#555',
            fontWeight: filtroArea === a ? 700 : 400,
            fontSize: 13
          }}>
            {a === 'TODAS' ? 'Todas as áreas' : a}
          </button>
        ))}
        <span style={{marginLeft:'auto', color:'#888', alignSelf:'center', fontSize:14}}>
          {filtrados.length} trechos encontrados
        </span>
      </div>

      <div style={{display:'grid', gap:12}}>
        {filtrados.map((t, i) => (
          <div key={i} style={{
            background:'#fff', borderRadius:12, padding:20,
            boxShadow:'0 2px 8px #0001',
            borderLeft:`5px solid ${CORES_NIVEL[t.nivel_20]}`
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <p style={{fontWeight:700, fontSize:16}}>KM {(t.km/1000).toFixed(1).replace('.','+')}</p>
                <p style={{color:'#666', fontSize:14, marginTop:4}}>{t.area}</p>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                {t.crescimento > 0 && (
                  <span style={{background:'#fef3c7', color:'#92400e', padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:600}}>
                    ↑ Crescendo
                  </span>
                )}
                <span style={{
                  background: CORES_NIVEL[t.nivel_20] + '22',
                  color: CORES_NIVEL[t.nivel_20],
                  padding:'4px 12px', borderRadius:6, fontSize:13, fontWeight:700
                }}>
                  Nível {t.nivel_20}
                </span>
              </div>
            </div>
            <div style={{display:'flex', gap:24, marginTop:12, fontSize:13, color:'#888'}}>
              <span>Nível anterior: <b style={{color:'#333'}}>{t.nivel_13}</b></span>
              <span>Crescimento: <b style={{color: t.crescimento > 0 ? '#ef4444' : '#4ade80'}}>{t.crescimento > 0 ? '+'+t.crescimento : t.crescimento}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}