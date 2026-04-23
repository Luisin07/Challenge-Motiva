import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const NIVEL_ACCENT = {
  'CRITICO': '#fca5a5',
  'ALTO':    '#fdba74',
  'MODERADO':'#fde68a',
  'BAIXO':   '#6ee7b7',
  'MEDIO':   '#fde68a',
};

const NIVEL_COR = {
  'CRITICO': '#dc2626',
  'ALTO':    '#ea580c',
  'MODERADO':'#ca8a04',
  'BAIXO':   '#16a34a',
  'MEDIO':   '#ca8a04',
};

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export default function FaunaFlora() {
  const [status, setStatus] = useState(null);
  const [especies, setEspecies] = useState([]);
  const [calendario, setCalendario] = useState([]);
  const [gbif, setGbif] = useState(null);

  useEffect(() => {
    fetch(`${API}/fauna/status`).then(r => r.json()).then(setStatus);
    fetch(`${API}/fauna/especies`).then(r => r.json()).then(setEspecies);
    fetch(`${API}/fauna/calendario`).then(r => r.json()).then(setCalendario);
    fetch(`${API}/fauna/gbif`).then(r => r.json()).then(setGbif);
  }, []);

  if (!status) return <Loading />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Fauna e Flora</h1>
          <p className="page-subtitle">Bioma Mata Atlântica · Dados científicos reais via GBIF</p>
        </div>
      </div>

      {/* Status do mês — padrão Motiva */}
      <div style={{
        background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 24,
        boxShadow: '0 2px 12px rgba(91,15,190,0.20)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -24, right: -24, width: 96, height: 96, borderRadius: '50%', background: NIVEL_ACCENT[status.restricao.nivel] + '20', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', marginBottom: 8, textTransform: 'uppercase' }}>
              STATUS AMBIENTAL — {MESES[status.mes_atual - 1].toUpperCase()}
            </p>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{status.restricao.motivo}</p>
            {status.especies_em_risco.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {status.especies_em_risco.map((e, i) => (
                  <span key={i} style={{ background: '#ffffff20', color: '#fff', padding: '4px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700, border: '1px solid #ffffff30' }}>
                    {e.nome}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span style={{ background: NIVEL_ACCENT[status.restricao.nivel] + '30', color: NIVEL_ACCENT[status.restricao.nivel], padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 800, border: `1px solid ${NIVEL_ACCENT[status.restricao.nivel]}50`, whiteSpace: 'nowrap' }}>
            {status.restricao.nivel}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: NIVEL_ACCENT[status.restricao.nivel], opacity: 0.8 }} />
      </div>

      {/* Calendário — padrão Motiva, accent por nível */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Calendário de Restrições Ambientais</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 6 }}>
          {calendario.map((c, i) => {
            const ativo = i === (status.mes_atual - 1);
            return (
              <div key={i} style={{
                background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
                borderRadius: 10, padding: '10px 4px 6px', textAlign: 'center',
                border: ativo ? '2px solid #fff' : '2px solid transparent',
                boxShadow: ativo ? '0 4px 14px rgba(91,15,190,0.35)' : '0 1px 4px rgba(0,0,0,0.08)',
                transform: ativo ? 'scale(1.07)' : 'scale(1)',
                transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden'
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{MESES[i]}</p>
                <p style={{ fontSize: 9, color: '#ffffff88', marginTop: 2, marginBottom: 4 }}>{c.nivel}</p>
                {/* Linha accent na base */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: NIVEL_ACCENT[c.nivel], opacity: 0.9 }} />
              </div>
            );
          })}
        </div>
        {/* Legenda */}
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {[['BAIXO','#6ee7b7'],['MODERADO','#fde68a'],['ALTO','#fdba74'],['CRITICO','#fca5a5']].map(([nivel, cor]) => (
            <div key={nivel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, background: cor, borderRadius: 2 }} />
              <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600 }}>{nivel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Espécies — header roxo Motiva, badge de risco */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Espécies Monitoradas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginBottom: 28 }}>
        {especies.map((e, i) => (
          <div key={i} style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#fff' }}>
            {/* Header roxo Motiva */}
            <div style={{
              background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
              padding: '20px 24px 16px', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -16, right: -16, width: 60, height: 60, borderRadius: '50%', background: NIVEL_ACCENT[e.risco] + '20', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#ffffff66', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>{e.tipo.toUpperCase()}</p>
                  <p style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{e.nome}</p>
                </div>
                <span style={{
                  background: NIVEL_ACCENT[e.risco] + '30',
                  color: NIVEL_ACCENT[e.risco],
                  padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  border: `1px solid ${NIVEL_ACCENT[e.risco]}50`
                }}>
                  {e.risco}
                </span>
              </div>
              <p style={{ color: '#ffffff88', fontSize: 13, marginTop: 8 }}>{e.descricao}</p>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: NIVEL_ACCENT[e.risco], opacity: 0.8 }} />
            </div>

            <div style={{ padding: '18px 24px' }}>
              <div style={{ background: '#f5f5f7', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>🌿 RECOMENDAÇÃO</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{e.recomendacao}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>PERÍODO DE RISCO</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {MESES.map((m, j) => {
                    const ativo = e.periodo_reproducao.includes(j + 1);
                    return (
                      <span key={j} style={{
                        padding: '3px 7px', borderRadius: 5, fontSize: 11,
                        background: ativo ? 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)' : '#f0f0f0',
                        color: ativo ? '#fff' : '#bbb',
                        fontWeight: ativo ? 700 : 400
                      }}>
                        {m}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GBIF */}
      {gbif && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Avistamentos Reais — GBIF</h3>
            <span style={{ fontSize: 12, color: '#aaa' }}>{gbif.total} ocorrências · {gbif.area_monitorada}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {gbif.ocorrencias.map((o, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 12, padding: '14px 18px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderLeft: '4px solid #5B0FBE'
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{o.especie}</p>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
                    📍 {o.latitude?.toFixed(4)}, {o.longitude?.toFixed(4)} · 📅 {o.data?.split('T')[0]}
                  </p>
                </div>
                <a href={o.link} target="_blank" rel="noreferrer" style={{
                  fontSize: 12, color: '#5B0FBE', textDecoration: 'none',
                  border: '1.5px solid #5B0FBE', padding: '5px 12px', borderRadius: 8,
                  fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12
                }}>
                  Ver no GBIF
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
