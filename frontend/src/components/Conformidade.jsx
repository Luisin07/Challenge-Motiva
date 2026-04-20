import React, { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Conformidade() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/conformidade').then(r => r.json()).then(setDados);
  }, []);

  if (!dados) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Conformidade Contratual</h1>
        <p className="page-subtitle">{dados.base_legal}</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32}}>
        {[
          { label: 'Conformidade Geral', value: `${dados.conformidade_geral}%`, bg: '#f0fdf4', cor: '#16a34a' },
          { label: 'Total em Risco', value: dados.total_em_risco, bg: '#fef2f2', cor: '#ef4444' },
          { label: 'Violações Iminentes', value: dados.violacoes_iminentes, bg: '#fef2f2', cor: '#ef4444' },
          { label: 'Risco em 7 dias', value: dados.risco_em_7_dias, bg: '#fff7ed', cor: '#f97316' },
        ].map((c, i) => (
          <div key={i} style={{
            background: c.bg, borderRadius:16, padding:24,
            border:`1px solid ${c.cor}22`
          }}>
            <p style={{color:'#888', fontSize:13, marginBottom:12, fontWeight:500}}>{c.label}</p>
            <p style={{fontSize:36, fontWeight:800, color:c.cor}}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{
        background:'#fef2f2', border:'1.5px solid #ef4444',
        borderRadius:12, padding:20, marginBottom:32
      }}>
        <p style={{fontWeight:700, color:'#ef4444', fontSize:15, marginBottom:4}}>
          ⚠️ Atenção — Risco de Multa
        </p>
        <p style={{color:'#555', fontSize:14}}>
          {dados.violacoes_iminentes} trechos com vegetação acima do limite contratual.
          Intervenção obrigatória em até 48 horas para evitar infração junto à ARTESP e ANTT.
        </p>
      </div>

      <h3 style={{marginBottom:16, fontWeight:700, fontSize:16}}>Trechos em Situação de Risco</h3>
      <div style={{display:'grid', gap:12}}>
        {dados.trechos.map((t, i) => {
          const urgente = t.situacao === 'VIOLAÇÃO IMINENTE';
          return (
            <div key={i} style={{
              background: urgente ? '#fef2f2' : '#fff7ed',
              borderRadius:12, padding:20,
              boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
              borderLeft:`4px solid ${urgente ? '#ef4444' : '#f97316'}`
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <p style={{fontWeight:700, fontSize:16}}>
                    KM {(t.km/1000).toFixed(1).replace('.','+')}</p>
                  <p style={{color:'#888', fontSize:13, marginTop:3}}>{t.area}</p>
                  <p style={{color:'#555', fontSize:13, marginTop:6}}>{t.motivo}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{
                    background: urgente ? '#ef4444' : '#f97316',
                    color:'#fff', padding:'5px 14px',
                    borderRadius:8, fontSize:12, fontWeight:700,
                    display:'block', marginBottom:8
                  }}>
                    {t.situacao}
                  </span>
                  <p style={{fontSize:12, color:'#888'}}>Prazo: <b>{t.prazo_legal}</b></p>
                  <p style={{fontSize:12, color:'#888'}}>Multa: <b style={{color: urgente ? '#ef4444' : '#f97316'}}>{t.risco_multa}</b></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}