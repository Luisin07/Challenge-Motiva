import React, { useEffect, useState } from 'react';

const CORES_SITUACAO = {
  'VIOLAÇÃO IMINENTE': { bg: '#fef2f2', border: '#ef4444', badge: '#ef4444' },
  'RISCO DE VIOLAÇÃO': { bg: '#fff7ed', border: '#f97316', badge: '#f97316' },
};

export default function Conformidade() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/conformidade').then(r => r.json()).then(setDados);
  }, []);

  if (!dados) return <p style={{color:'#888'}}>Carregando...</p>;

  return (
    <div>
      <h1 style={{marginBottom: 8, fontSize: 24}}>Conformidade Contratual</h1>
      <p style={{color:'#666', marginBottom: 32}}>{dados.base_legal}</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32}}>
        {[
          { label: 'Conformidade Geral', value: `${dados.conformidade_geral}%`, cor: dados.conformidade_geral > 90 ? '#4ade80' : '#ef4444' },
          { label: 'Total em Risco', value: dados.total_em_risco, cor: '#ef4444' },
          { label: 'Violações Iminentes', value: dados.violacoes_iminentes, cor: '#ef4444' },
          { label: 'Risco em 7 dias', value: dados.risco_em_7_dias, cor: '#f97316' },
        ].map((c, i) => (
          <div key={i} style={{
            background:'#fff', borderRadius:12, padding:24,
            boxShadow:'0 2px 8px #0001',
            borderTop:`4px solid ${c.cor}`
          }}>
            <p style={{color:'#888', fontSize:13, marginBottom:8}}>{c.label}</p>
            <p style={{fontSize:32, fontWeight:700, color:c.cor}}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{
        background:'#fef2f2', border:'2px solid #ef4444',
        borderRadius:12, padding:20, marginBottom:32
      }}>
        <p style={{fontWeight:700, color:'#ef4444', fontSize:16, marginBottom:4}}>
          ⚠️ Atenção — Risco de Multa
        </p>
        <p style={{color:'#555', fontSize:14}}>
          {dados.violacoes_iminentes} trechos com vegetação acima do limite contratual.
          Intervenção obrigatória em até 48 horas para evitar infração junto à ARTESP e ANTT.
        </p>
      </div>

      <h3 style={{marginBottom:16}}>Trechos em Situação de Risco</h3>
      <div style={{display:'grid', gap:12}}>
        {dados.trechos.map((t, i) => {
          const c = CORES_SITUACAO[t.situacao] || CORES_SITUACAO['RISCO DE VIOLAÇÃO'];
          return (
            <div key={i} style={{
              background: c.bg, borderRadius:12, padding:20,
              boxShadow:'0 2px 8px #0001',
              borderLeft:`5px solid ${c.border}`
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <p style={{fontWeight:700, fontSize:16}}>
                    KM {(t.km/1000).toFixed(1).replace('.','+')}</p>
                  <p style={{color:'#666', fontSize:14, marginTop:4}}>{t.area}</p>
                  <p style={{color:'#555', fontSize:13, marginTop:6}}>{t.motivo}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{
                    background: c.badge, color:'#fff',
                    padding:'6px 14px', borderRadius:8,
                    fontSize:12, fontWeight:700, display:'block', marginBottom:8
                  }}>
                    {t.situacao}
                  </span>
                  <p style={{fontSize:12, color:'#888'}}>Prazo: <b>{t.prazo_legal}</b></p>
                  <p style={{fontSize:12, color:'#888'}}>Multa: <b style={{color:c.badge}}>{t.risco_multa}</b></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}