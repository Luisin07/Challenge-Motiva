import React, { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Criticos({ filtroInicial, onClear }) {
  const [criticos, setCriticos] = useState([]);
  const [filtroNivel, setFiltroNivel] = useState('TODOS');
  const [filtroArea, setFiltroArea] = useState('TODAS');

  useEffect(() => {
    fetch('http://localhost:8000/criticos').then(r => r.json()).then(setCriticos);
  }, []);

  useEffect(() => {
    if (filtroInicial) {
      if (filtroInicial.nivel) setFiltroNivel(String(filtroInicial.nivel));
      if (filtroInicial.area) setFiltroArea(filtroInicial.area);
    }
  }, [filtroInicial]);

  if (!criticos.length) return <Loading />;

  const areas = ['TODAS', ...new Set(criticos.map(t => t.area))];

  const filtrados = criticos
    .filter(t => filtroNivel === 'TODOS' || t.nivel_20 === parseInt(filtroNivel))
    .filter(t => filtroArea === 'TODAS' || t.area === filtroArea);

  const TEMA = {
    1: { bg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', label: 'Baixo' },
    2: { bg: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)', label: 'Moderado' },
    3: { bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', label: 'Crítico' },
  };

  const getMensagem = (t) => {
    if (t.nivel_20 === 3) return { icon: '🚨', texto: 'Nível máximo atingido — intervenção obrigatória', cor: '#ef4444', bg: '#fef2f2' };
    if (t.crescimento > 0) return { icon: '⬆️', texto: 'Vegetação crescendo — intervenção necessária', cor: '#ef4444', bg: '#fef2f2' };
    if (t.crescimento < 0) return { icon: '⬇️', texto: 'Vegetação reduzindo — monitorar', cor: '#16a34a', bg: '#f0fdf4' };
    return { icon: '➡️', texto: 'Nível estável — manter monitoramento', cor: '#888', bg: '#f5f5f7' };
  };

  const limparFiltro = () => {
    setFiltroNivel('TODOS');
    setFiltroArea('TODAS');
    if (onClear) onClear();
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h1 className="page-title">Trechos Críticos</h1>
          <p className="page-subtitle">Trechos que requerem intervenção imediata</p>
        </div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          {filtroInicial && (
            <button onClick={limparFiltro} style={{
              background:'#f0f0f0', border:'none', borderRadius:8,
              padding:'8px 14px', fontSize:12, fontWeight:600,
              cursor:'pointer', color:'#555'
            }}>
              ✕ Limpar filtro do mapa
            </button>
          )}
          <div style={{
            background:'#fef2f2', border:'1.5px solid #ef444433',
            borderRadius:12, padding:'12px 24px', textAlign:'center'
          }}>
            <p style={{fontSize:11, color:'#888', marginBottom:2, fontWeight:500}}>Total encontrado</p>
            <p style={{fontSize:28, fontWeight:800, color:'#ef4444', lineHeight:1}}>{filtrados.length}</p>
          </div>
        </div>
      </div>

      <div style={{display:'flex', gap:8, marginBottom:12, flexWrap:'wrap'}}>
        {['TODOS', '2', '3'].map(f => (
          <button key={f} className={`filter-btn ${filtroNivel === f ? 'ativo' : ''}`}
            onClick={() => setFiltroNivel(f)}>
            {f === 'TODOS' ? 'Todos os níveis' : `Nível ${f} — ${TEMA[parseInt(f)]?.label}`}
          </button>
        ))}
      </div>

      <div style={{display:'flex', gap:8, marginBottom:32, flexWrap:'wrap'}}>
        {areas.map(a => (
          <button key={a} className={`filter-btn ${filtroArea === a ? 'ativo' : ''}`}
            onClick={() => setFiltroArea(a)} style={{fontSize:12}}>
            {a === 'TODAS' ? 'Todas as áreas' : a.replace('Canteiro ', '')}
          </button>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
        {filtrados.map((t, i) => {
          const tema = TEMA[t.nivel_20];
          const msg = getMensagem(t);
          return (
            <div key={i} style={{
              borderRadius:18, overflow:'hidden',
              boxShadow:'0 4px 20px rgba(0,0,0,0.10)',
              background:'#fff'
            }}>
              <div style={{background: tema.bg, padding:'24px 24px 20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <p style={{color:'#ffffff99', fontSize:11, fontWeight:600, letterSpacing:1, marginBottom:4}}>
                      RODOANEL MÁRIO COVAS
                    </p>
                    <p style={{color:'#fff', fontSize:28, fontWeight:800, letterSpacing:-0.5}}>
                      KM {(t.km/1000).toFixed(1).replace('.','+')}</p>
                  </div>
                  <span style={{
                    background:'#ffffff25', color:'#fff',
                    padding:'6px 14px', borderRadius:8,
                    fontSize:13, fontWeight:700
                  }}>
                    Nível {t.nivel_20}
                  </span>
                </div>
                <p style={{color:'#ffffff99', fontSize:13, marginTop:8}}>{t.area}</p>
              </div>

              <div style={{padding:'20px 24px'}}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
                  <div>
                    <p style={{fontSize:10, color:'#aaa', fontWeight:600, letterSpacing:0.5, marginBottom:4}}>
                      NÍVEL ANTERIOR
                    </p>
                    <p style={{fontSize:22, fontWeight:800, color:'#1a1a2e'}}>{t.nivel_13}</p>
                  </div>
                  <div>
                    <p style={{fontSize:10, color:'#aaa', fontWeight:600, letterSpacing:0.5, marginBottom:4}}>
                      CRESCIMENTO
                    </p>
                    <p style={{
                      fontSize:22, fontWeight:800,
                      color: t.crescimento > 0 ? '#ef4444' : t.crescimento < 0 ? '#16a34a' : '#888'
                    }}>
                      {t.crescimento > 0 ? `+${t.crescimento}` : t.crescimento === 0 ? '—' : t.crescimento}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: msg.bg, borderRadius:10, padding:'10px 14px',
                  display:'flex', alignItems:'center', gap:8
                }}>
                  <span style={{fontSize:14}}>{msg.icon}</span>
                  <p style={{fontSize:12, fontWeight:600, color: msg.cor}}>{msg.texto}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}