import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Criticos({ filtroInicial, onClear }) {
  const [criticos, setCriticos] = useState([]);
  const [filtroNivel, setFiltroNivel] = useState('TODOS');
  const [filtroArea, setFiltroArea] = useState('TODAS');

  useEffect(() => {
    fetch(`${API}/criticos`).then(r => r.json()).then(setCriticos);
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

  // Accent por nível — todos roxos Motiva, diferenciados pela linha na base
  const NIVEL_ACCENT = {
    1: { accent: '#6ee7b7', label: 'Baixo',    badge: '#6ee7b720', badgeText: '#6ee7b7' },
    2: { accent: '#fde68a', label: 'Moderado', badge: '#fde68a20', badgeText: '#fde68a' },
    3: { accent: '#fca5a5', label: 'Crítico',  badge: '#fca5a520', badgeText: '#fca5a5' },
  };

  const getMensagem = (t) => {
    if (t.nivel_20 === 3) return { icon: '🚨', texto: 'Nível máximo atingido — intervenção obrigatória', cor: '#fca5a5', bg: '#ffffff15' };
    if (t.crescimento > 0) return { icon: '⬆️', texto: 'Vegetação crescendo — intervenção necessária', cor: '#fde68a', bg: '#ffffff15' };
    if (t.crescimento < 0) return { icon: '⬇️', texto: 'Vegetação reduzindo — monitorar', cor: '#6ee7b7', bg: '#ffffff15' };
    return { icon: '➡️', texto: 'Nível estável — manter monitoramento', cor: '#ffffff88', bg: '#ffffff10' };
  };

  const limparFiltro = () => {
    setFiltroNivel('TODOS');
    setFiltroArea('TODAS');
    if (onClear) onClear();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Trechos Críticos</h1>
          <p className="page-subtitle">Trechos que requerem intervenção imediata</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {filtroInicial && (
            <button onClick={limparFiltro} style={{
              background: '#f0f0f0', border: 'none', borderRadius: 8,
              padding: '8px 14px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', color: '#555'
            }}>
              ✕ Limpar filtro do mapa
            </button>
          )}
          <div style={{
            background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
            borderRadius: 12, padding: '12px 24px', textAlign: 'center',
            boxShadow: '0 2px 12px rgba(91,15,190,0.20)'
          }}>
            <p style={{ fontSize: 11, color: '#ffffff66', marginBottom: 2, fontWeight: 600, letterSpacing: 0.5 }}>TOTAL ENCONTRADO</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{filtrados.length}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {['TODOS', '2', '3'].map(f => (
          <button key={f} className={`filter-btn ${filtroNivel === f ? 'ativo' : ''}`}
            onClick={() => setFiltroNivel(f)}>
            {f === 'TODOS' ? 'Todos os níveis' : `Nível ${f} — ${NIVEL_ACCENT[parseInt(f)]?.label}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {areas.map(a => (
          <button key={a} className={`filter-btn ${filtroArea === a ? 'ativo' : ''}`}
            onClick={() => setFiltroArea(a)} style={{ fontSize: 12 }}>
            {a === 'TODAS' ? 'Todas as áreas' : a.replace('Canteiro ', '')}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {filtrados.map((t, i) => {
          const nivel = NIVEL_ACCENT[t.nivel_20];
          const msg = getMensagem(t);
          return (
            <div key={i} style={{
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(91,15,190,0.15)',
              background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
              position: 'relative'
            }}>
              {/* Círculo decorativo */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 80, height: 80, borderRadius: '50%',
                background: nivel.accent + '15', pointerEvents: 'none'
              }} />

              <div style={{ padding: '20px 22px 16px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ color: '#ffffff55', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 4, textTransform: 'uppercase' }}>
                      Rodoanel Mário Covas
                    </p>
                    <p style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>
                      KM {(t.km / 1000).toFixed(1).replace('.', '+')}
                    </p>
                    <p style={{ color: '#ffffff88', fontSize: 12, marginTop: 5 }}>{t.area}</p>
                  </div>
                  <span style={{
                    background: nivel.badge,
                    color: nivel.badgeText,
                    padding: '5px 12px', borderRadius: 8,
                    fontSize: 12, fontWeight: 700,
                    border: `1px solid ${nivel.accent}40`,
                    whiteSpace: 'nowrap'
                  }}>
                    Nível {t.nivel_20}
                  </span>
                </div>

                {/* Métricas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div style={{ background: '#ffffff10', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ fontSize: 9, color: '#ffffff55', fontWeight: 700, letterSpacing: 0.8, marginBottom: 4, textTransform: 'uppercase' }}>Nível Anterior</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{t.nivel_13}</p>
                  </div>
                  <div style={{ background: '#ffffff10', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ fontSize: 9, color: '#ffffff55', fontWeight: 700, letterSpacing: 0.8, marginBottom: 4, textTransform: 'uppercase' }}>Crescimento</p>
                    <p style={{
                      fontSize: 22, fontWeight: 800,
                      color: t.crescimento > 0 ? '#fca5a5' : t.crescimento < 0 ? '#6ee7b7' : '#ffffff66'
                    }}>
                      {t.crescimento > 0 ? `+${t.crescimento}` : t.crescimento === 0 ? '—' : t.crescimento}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div style={{
                  background: msg.bg, borderRadius: 8, padding: '9px 12px',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <span style={{ fontSize: 13 }}>{msg.icon}</span>
                  <p style={{ fontSize: 11, fontWeight: 600, color: msg.cor }}>{msg.texto}</p>
                </div>
              </div>

              {/* Linha accent na base */}
              <div style={{ height: 3, background: nivel.accent, opacity: 0.85 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
