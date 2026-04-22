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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h1 className="page-title">Conformidade Contratual</h1>
          <p className="page-subtitle">{dados.base_legal}</p>
        </div>
        <div style={{
          background: dados.conformidade_geral >= 95 ? '#f0fdf4' : '#fef2f2',
          border: `1.5px solid ${dados.conformidade_geral >= 95 ? '#16a34a33' : '#ef444433'}`,
          borderRadius:12, padding:'12px 24px', textAlign:'center'
        }}>
          <p style={{fontSize:11, color:'#888', marginBottom:2, fontWeight:500}}>Conformidade Geral</p>
          <p style={{fontSize:28, fontWeight:800, lineHeight:1,
            color: dados.conformidade_geral >= 95 ? '#16a34a' : '#ef4444'
          }}>
            {dados.conformidade_geral}%
          </p>
        </div>
      </div>

      {/* Cards métricas */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24}}>
        {[
          { label: 'Violações Iminentes', value: dados.violacoes_iminentes, bg:'#fef2f2', cor:'#ef4444', desc:'Intervenção em 48h', icon:'🚨' },
          { label: 'Risco em 7 dias', value: dados.risco_em_7_dias, bg:'#fff7ed', cor:'#f97316', desc:'Crescimento acelerado', icon:'⚠️' },
          { label: 'Total em Risco', value: dados.total_em_risco, bg:'#fefce8', cor:'#ca8a04', desc:'Trechos monitorados', icon:'📍' },
        ].map((c, i) => (
          <div key={i} style={{
            background: c.bg, borderRadius:16, padding:24,
            border:`1px solid ${c.cor}22`
          }}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <p style={{color:'#888', fontSize:12, fontWeight:500}}>{c.label}</p>
            </div>
            <p style={{fontSize:40, fontWeight:800, color:c.cor, lineHeight:1}}>{c.value}</p>
            <p style={{color:'#bbb', fontSize:11, marginTop:8}}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Alerta */}
      <div style={{
        borderRadius:18, overflow:'hidden',
        boxShadow:'0 4px 20px rgba(0,0,0,0.08)',
        marginBottom:28
      }}>
        <div style={{
          background:'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          padding:'20px 28px'
        }}>
          <p style={{color:'#ffffff99', fontSize:11, fontWeight:600, letterSpacing:1, marginBottom:4}}>
            ALERTA CONTRATUAL
          </p>
          <p style={{color:'#fff', fontSize:20, fontWeight:800}}>
            ⚠️ Risco de Multa — ARTESP / ANTT
          </p>
        </div>
        <div style={{background:'#fff', padding:'16px 28px'}}>
          <p style={{fontSize:14, color:'#555'}}>
            {dados.violacoes_iminentes} trechos com vegetação acima do limite contratual.
            Intervenção obrigatória em até 48 horas para evitar infração junto à ARTESP e ANTT.
          </p>
        </div>
      </div>

      {/* Trechos em risco */}
      <h3 style={{fontSize:16, fontWeight:700, marginBottom:16}}>Trechos em Situação de Risco</h3>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16}}>
        {dados.trechos.map((t, i) => {
          const urgente = t.situacao === 'VIOLAÇÃO IMINENTE';
          const bg = urgente
            ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
            : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)';
          return (
            <div key={i} style={{
              borderRadius:16, overflow:'hidden',
              boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
              background:'#fff'
            }}>
              <div style={{background: bg, padding:'18px 20px 14px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <p style={{color:'#ffffff99', fontSize:10, fontWeight:600, letterSpacing:1, marginBottom:3}}>
                      RODOANEL MÁRIO COVAS
                    </p>
                    <p style={{color:'#fff', fontSize:22, fontWeight:800}}>
                      KM {(t.km/1000).toFixed(1).replace('.','+')}</p>
                  </div>
                  <span style={{
                    background:'#ffffff25', color:'#fff',
                    padding:'4px 10px', borderRadius:7,
                    fontSize:11, fontWeight:700
                  }}>
                    {t.situacao}
                  </span>
                </div>
                <p style={{color:'#ffffff99', fontSize:12, marginTop:6}}>{t.area}</p>
              </div>
              <div style={{padding:'14px 20px'}}>
                <p style={{fontSize:13, color:'#555', marginBottom:12}}>{t.motivo}</p>
                <div style={{display:'flex', gap:16}}>
                  <div>
                    <p style={{fontSize:10, color:'#aaa', fontWeight:600, marginBottom:2}}>PRAZO</p>
                    <p style={{fontSize:14, fontWeight:700, color:'#1a1a2e'}}>{t.prazo_legal}</p>
                  </div>
                  <div>
                    <p style={{fontSize:10, color:'#aaa', fontWeight:600, marginBottom:2}}>RISCO DE MULTA</p>
                    <p style={{fontSize:14, fontWeight:700, color:'#ef4444'}}>{t.risco_multa}</p>
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