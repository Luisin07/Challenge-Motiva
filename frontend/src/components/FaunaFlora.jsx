import React, { useEffect, useState } from 'react';

import Loading from './Loading';

const CORES_NIVEL = {
  'CRITICO': '#ef4444',
  'ALTO': '#f97316',
  'MODERADO': '#facc15',
  'BAIXO': '#4ade80',
  'MEDIO': '#facc15',
};

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export default function FaunaFlora() {
  const [status, setStatus] = useState(null);
  const [especies, setEspecies] = useState([]);
  const [calendario, setCalendario] = useState([]);
  const [alerta, setAlerta] = useState(null);
  const [gbif, setGbif] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/fauna/status').then(r => r.json()).then(setStatus);
    fetch('http://localhost:8000/fauna/especies').then(r => r.json()).then(setEspecies);
    fetch('http://localhost:8000/fauna/calendario').then(r => r.json()).then(setCalendario);
    fetch('http://localhost:8000/fauna/alerta').then(r => r.json()).then(setAlerta);
    fetch('http://localhost:8000/fauna/gbif').then(r => r.json()).then(setGbif);
  }, []);

  if (!status) return <Loading />;

  return (
    <div>
      <h1 style={{marginBottom: 8, fontSize: 24}}>Fauna e Flora</h1>
      <p style={{color:'#666', marginBottom: 32}}>Monitoramento ambiental — Bioma Mata Atlântica · Rodoanel Mário Covas</p>

      <div style={{
        background: CORES_NIVEL[status.restricao.nivel] + '22',
        border: `2px solid ${CORES_NIVEL[status.restricao.nivel]}`,
        borderRadius: 12, padding: 24, marginBottom: 32
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <p style={{fontWeight: 700, fontSize: 18}}>Status Ambiental — {MESES[status.mes_atual - 1]}</p>
            <p style={{color:'#555', marginTop: 4}}>{status.restricao.motivo}</p>
          </div>
          <span style={{
            background: CORES_NIVEL[status.restricao.nivel],
            color: '#fff', padding: '8px 20px',
            borderRadius: 8, fontWeight: 700, fontSize: 16
          }}>
            {status.restricao.nivel}
          </span>
        </div>
        {status.especies_em_risco.length > 0 && (
          <div style={{marginTop: 16}}>
            <p style={{fontSize: 13, color: '#666', marginBottom: 8}}>Espécies em período de risco este mês:</p>
            <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
              {status.especies_em_risco.map((e, i) => (
                <span key={i} style={{
                  background: '#fff', border: `1px solid ${CORES_NIVEL[e.risco]}`,
                  color: CORES_NIVEL[e.risco], padding: '4px 12px',
                  borderRadius: 6, fontSize: 13, fontWeight: 600
                }}>
                  {e.nome}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{background:'#fff', borderRadius:12, padding:24, marginBottom:32, boxShadow:'0 2px 8px #0001'}}>
        <h3 style={{marginBottom:16}}>Calendário de Restrições Ambientais</h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:6}}>
          {calendario.map((c, i) => (
            <div key={i} style={{
              background: CORES_NIVEL[c.nivel] + '33',
              border: `2px solid ${CORES_NIVEL[c.nivel]}`,
              borderRadius: 8, padding: '8px 4px', textAlign:'center'
            }}>
              <p style={{fontSize: 12, fontWeight: 700, color: CORES_NIVEL[c.nivel]}}>{MESES[i]}</p>
              <p style={{fontSize: 10, color:'#555', marginTop:2}}>{c.nivel}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{marginBottom:16}}>Espécies Monitoradas</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32}}>
        {especies.map((e, i) => (
          <div key={i} style={{
            background:'#fff', borderRadius:12, padding:20,
            boxShadow:'0 2px 8px #0001',
            borderLeft:`5px solid ${CORES_NIVEL[e.risco]}`
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
              <div>
                <p style={{fontWeight:700, fontSize:16}}>{e.nome}</p>
                <p style={{fontSize:13, color:'#888'}}>{e.tipo}</p>
              </div>
              <span style={{
                background: CORES_NIVEL[e.risco] + '22',
                color: CORES_NIVEL[e.risco],
                padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:700
              }}>
                {e.risco}
              </span>
            </div>
            <p style={{fontSize:13, color:'#555', marginBottom:8}}>{e.descricao}</p>
            <div style={{background:'#f8f8f8', borderRadius:8, padding:10}}>
              <p style={{fontSize:11, color:'#888', marginBottom:4}}>🌿 Recomendação</p>
              <p style={{fontSize:13, fontWeight:500}}>{e.recomendacao}</p>
            </div>
            <div style={{marginTop:10}}>
              <p style={{fontSize:11, color:'#888', marginBottom:6}}>Período de risco:</p>
              <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                {MESES.map((m, j) => (
                  <span key={j} style={{
                    padding:'2px 6px', borderRadius:4, fontSize:11,
                    background: e.periodo_reproducao.includes(j+1) ? CORES_NIVEL[e.risco] : '#f0f0f0',
                    color: e.periodo_reproducao.includes(j+1) ? '#fff' : '#aaa',
                    fontWeight: e.periodo_reproducao.includes(j+1) ? 700 : 400
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {gbif && (
        <div style={{marginTop:32}}>
          <h3 style={{marginBottom:8}}>Avistamentos Reais — GBIF</h3>
          <p style={{color:'#666', fontSize:13, marginBottom:16}}>
            {gbif.total} ocorrências reais · {gbif.area_monitorada} · Fonte: {gbif.fonte}
          </p>
          <div style={{display:'grid', gap:10}}>
            {gbif.ocorrencias.map((o, i) => (
              <div key={i} style={{
                background:'#fff', borderRadius:10, padding:16,
                boxShadow:'0 2px 6px #0001',
                display:'flex', justifyContent:'space-between', alignItems:'center'
              }}>
                <div>
                  <p style={{fontWeight:600, fontSize:14}}>{o.especie}</p>
                  <p style={{fontSize:12, color:'#888', marginTop:2}}>
                    📍 {o.latitude?.toFixed(4)}, {o.longitude?.toFixed(4)} · 📅 {o.data?.split('T')[0]}
                  </p>
                </div>
                <a href={o.link} target="_blank" rel="noreferrer" style={{
                  fontSize:12, color:'#3b82f6', textDecoration:'none',
                  border:'1px solid #3b82f6', padding:'4px 10px', borderRadius:6
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