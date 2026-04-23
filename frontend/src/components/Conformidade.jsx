import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Conformidade() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch(`${API}/conformidade`).then(r => r.json()).then(setDados);
  }, []);

  if (!dados) return <Loading />;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Conformidade Contratual</h1>
        <p className="page-subtitle">{dados.base_legal}</p>
      </div>

      {/* Cards BI Motiva */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>

        {/* Card 1 — Violações */}
        <div style={{ background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)', borderRadius: 14, padding: '18px 20px 16px', boxShadow: '0 2px 12px rgba(91,15,190,0.20)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 72, height: 72, borderRadius: '50%', background: '#fca5a520', pointerEvents: 'none' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', marginBottom: 12, textTransform: 'uppercase' }}>VIOLAÇÕES IMINENTES</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>{dados.violacoes_iminentes}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: dados.violacoes_iminentes > 0 ? 12 : 0 }}>
            <p style={{ fontSize: 11, color: '#ffffff55' }}>Intervenção em 48h</p>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fca5a5', whiteSpace: 'nowrap', marginLeft: 6 }}>
              {dados.violacoes_iminentes > 0 ? '▲ ação necessária' : '● ok'}
            </span>
          </div>
          {dados.violacoes_iminentes > 0 && (
            <div style={{ background: '#ffffff15', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid #fca5a5' }}>
              <p style={{ fontSize: 11, color: '#fca5a5', fontWeight: 600, lineHeight: 1.4 }}>
                Intervenção obrigatória em até 48h — risco de infração ARTESP/ANTT
              </p>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#fca5a5', opacity: 0.8 }} />
        </div>

        {/* Card 2 — Risco em 7 dias */}
        <div style={{ background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)', borderRadius: 14, padding: '18px 20px 16px', boxShadow: '0 2px 12px rgba(91,15,190,0.20)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 72, height: 72, borderRadius: '50%', background: '#fde68a20', pointerEvents: 'none' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', marginBottom: 12, textTransform: 'uppercase' }}>RISCO EM 7 DIAS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>{dados.risco_em_7_dias}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 11, color: '#ffffff55' }}>Crescimento acelerado</p>
            <span style={{ fontSize: 10, fontWeight: 700, color: dados.risco_em_7_dias > 0 ? '#fde68a' : '#6ee7b7', whiteSpace: 'nowrap', marginLeft: 6 }}>
              {dados.risco_em_7_dias > 0 ? '▲ monitorar' : '● estável'}
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#fde68a', opacity: 0.8 }} />
        </div>

        {/* Card 3 — Conformidade */}
        <div style={{ background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)', borderRadius: 14, padding: '18px 20px 16px', boxShadow: '0 2px 12px rgba(91,15,190,0.20)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 72, height: 72, borderRadius: '50%', background: (dados.conformidade_geral >= 95 ? '#6ee7b7' : '#fca5a5') + '20', pointerEvents: 'none' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', marginBottom: 12, textTransform: 'uppercase' }}>CONFORMIDADE GERAL</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>{dados.conformidade_geral}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffffbb' }}>%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 11, color: '#ffffff55' }}>ARTESP / ANTT</p>
            <span style={{ fontSize: 10, fontWeight: 700, color: dados.conformidade_geral >= 95 ? '#6ee7b7' : '#fca5a5', whiteSpace: 'nowrap', marginLeft: 6 }}>
              {dados.conformidade_geral >= 95 ? '● dentro do limite' : '▼ abaixo do alvo'}
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: dados.conformidade_geral >= 95 ? '#6ee7b7' : '#fca5a5', opacity: 0.8 }} />
        </div>
      </div>

      {/* Trechos em risco */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Trechos em Situação de Risco</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {dados.trechos.map((t, i) => {
          const urgente = t.situacao === 'VIOLAÇÃO IMINENTE';
          const corBorda = urgente ? '#ef4444' : '#f97316';
          const bgHeader = urgente ? '#fef2f2' : '#fff7ed';
          return (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: '#fff' }}>
              <div style={{ background: bgHeader, borderLeft: `4px solid ${corBorda}`, padding: '18px 20px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#aaa', fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 3 }}>RODOANEL MÁRIO COVAS</p>
                    <p style={{ color: '#1a1a2e', fontSize: 22, fontWeight: 800 }}>KM {(t.km / 1000).toFixed(1).replace('.', '+')}</p>
                  </div>
                  <span style={{ background: corBorda + '20', color: corBorda, padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700 }}>{t.situacao}</span>
                </div>
                <p style={{ color: '#888', fontSize: 12, marginTop: 6 }}>{t.area}</p>
              </div>
              <div style={{ padding: '14px 20px' }}>
                <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>{t.motivo}</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, marginBottom: 2 }}>PRAZO</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{t.prazo_legal}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, marginBottom: 2 }}>RISCO DE MULTA</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: corBorda }}>{t.risco_multa}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
