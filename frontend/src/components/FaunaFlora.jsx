import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const CORES = {
  'CRITICO': '#dc2626',
  'ALTO': '#ea580c',
  'MODERADO': '#ca8a04',
  'BAIXO': '#16a34a',
  'MEDIO': '#ca8a04',
};

const GRADIENTS = {
  'CRITICO': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  'ALTO': 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
  'MODERADO': 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
  'BAIXO': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
  'MEDIO': 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
};

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export default function FaunaFlora() {
  const [status, setStatus] = useState(null);
  const [especies, setEspecies] = useState([]);
  const [calendario, setCalendario] = useState([]);
  const [gbif, setGbif] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/fauna/status').then(r => r.json()).then(setStatus);
    fetch('http://localhost:8000/fauna/especies').then(r => r.json()).then(setEspecies);
    fetch('http://localhost:8000/fauna/calendario').then(r => r.json()).then(setCalendario);
    fetch('http://localhost:8000/fauna/gbif').then(r => r.json()).then(setGbif);
  }, []);

  if (!status) return <Loading />;

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h1 className="page-title">Fauna e Flora</h1>
          <p className="page-subtitle">Bioma Mata Atlântica · Dados científicos reais via GBIF</p>
        </div>
        <div style={{
          background: CORES[status.restricao.nivel] + '15',
          border: `1.5px solid ${CORES[status.restricao.nivel]}33`,
          borderRadius:12, padding:'12px 24px', textAlign:'center'
        }}>
          <p style={{fontSize:11, color:'#888', marginBottom:2, fontWeight:500}}>Status Ambiental</p>
          <p style={{fontSize:20, fontWeight:800, lineHeight:1, color: CORES[status.restricao.nivel]}}>
            {status.restricao.nivel}
          </p>
        </div>
      </div>

      {/* Status do mês */}
      <div style={{borderRadius:18, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', marginBottom:24}}>
        <div style={{background: GRADIENTS[status.restricao.nivel], padding:'22px 28px 18px'}}>
          <p style={{color:'#ffffff99', fontSize:11, fontWeight:600, letterSpacing:1, marginBottom:4}}>
            STATUS AMBIENTAL — {MESES[status.mes_atual - 1].toUpperCase()}
          </p>
          <p style={{color:'#fff', fontSize:22, fontWeight:800}}>{status.restricao.motivo}</p>
        </div>
        {status.especies_em_risco.length > 0 && (
          <div style={{background:'#fff', padding:'16px 28px'}}>
            <p style={{fontSize:12, color:'#888', marginBottom:10}}>Espécies em período de risco este mês:</p>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {status.especies_em_risco.map((e, i) => (
                <span key={i} style={{
                  background: CORES[e.risco] + '15',
                  border: `1px solid ${CORES[e.risco]}`,
                  color: CORES[e.risco],
                  padding:'5px 14px', borderRadius:8,
                  fontSize:13, fontWeight:700
                }}>
                  {e.nome}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Calendário */}
      <div className="card" style={{marginBottom:24}}>
        <h3 style={{fontSize:15, fontWeight:700, marginBottom:16}}>Calendário de Restrições Ambientais</h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:6}}>
          {calendario.map((c, i) => (
            <div key={i} style={{
              background: GRADIENTS[c.nivel],
              borderRadius:10, padding:'10px 4px', textAlign:'center',
              opacity: i === (status.mes_atual - 1) ? 1 : 0.7,
              boxShadow: i === (status.mes_atual - 1) ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
              transform: i === (status.mes_atual - 1) ? 'scale(1.05)' : 'scale(1)',
              transition:'all 0.2s'
            }}>
              <p style={{fontSize:11, fontWeight:700, color:'#fff'}}>{MESES[i]}</p>
              <p style={{fontSize:9, color:'#ffffff99', marginTop:2}}>{c.nivel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Espécies */}
      <h3 style={{fontSize:16, fontWeight:700, marginBottom:16}}>Espécies Monitoradas</h3>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20, marginBottom:28}}>
        {especies.map((e, i) => (
          <div key={i} style={{
            borderRadius:18, overflow:'hidden',
            boxShadow:'0 4px 20px rgba(0,0,0,0.08)',
            background:'#fff'
          }}>
            <div style={{background: GRADIENTS[e.risco], padding:'20px 24px 16px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <p style={{color:'#ffffff99', fontSize:11, fontWeight:600, letterSpacing:1, marginBottom:4}}>
                    {e.tipo.toUpperCase()}
                  </p>
                  <p style={{color:'#fff', fontSize:20, fontWeight:800}}>{e.nome}</p>
                </div>
                <span style={{
                  background:'#ffffff25', color:'#fff',
                  padding:'5px 12px', borderRadius:8,
                  fontSize:12, fontWeight:700
                }}>
                  {e.risco}
                </span>
              </div>
              <p style={{color:'#ffffff99', fontSize:13, marginTop:8}}>{e.descricao}</p>
            </div>

            <div style={{padding:'18px 24px'}}>
              <div style={{background:'#f5f5f7', borderRadius:10, padding:'12px 14px', marginBottom:14}}>
                <p style={{fontSize:10, color:'#aaa', fontWeight:600, letterSpacing:0.5, marginBottom:4}}>🌿 RECOMENDAÇÃO</p>
                <p style={{fontSize:13, fontWeight:500, color:'#333'}}>{e.recomendacao}</p>
              </div>
              <div>
                <p style={{fontSize:10, color:'#aaa', fontWeight:600, letterSpacing:0.5, marginBottom:8}}>PERÍODO DE RISCO</p>
                <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                  {MESES.map((m, j) => (
                    <span key={j} style={{
                      padding:'3px 7px', borderRadius:5, fontSize:11,
                      background: e.periodo_reproducao.includes(j+1) ? GRADIENTS[e.risco] : '#f0f0f0',
                      color: e.periodo_reproducao.includes(j+1) ? '#fff' : '#bbb',
                      fontWeight: e.periodo_reproducao.includes(j+1) ? 700 : 400
                    }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GBIF */}
      {gbif && (
        <div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
            <h3 style={{fontSize:16, fontWeight:700}}>Avistamentos Reais — GBIF</h3>
            <span style={{fontSize:12, color:'#aaa'}}>
              {gbif.total} ocorrências · {gbif.area_monitorada}
            </span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12}}>
            {gbif.ocorrencias.map((o, i) => (
              <div key={i} style={{
                background:'#fff', borderRadius:12, padding:'14px 18px',
                boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
                display:'flex', justifyContent:'space-between', alignItems:'center',
                borderLeft:'4px solid #5B0FBE'
              }}>
                <div>
                  <p style={{fontWeight:600, fontSize:14, color:'#1a1a2e'}}>{o.especie}</p>
                  <p style={{fontSize:12, color:'#888', marginTop:3}}>
                    📍 {o.latitude?.toFixed(4)}, {o.longitude?.toFixed(4)} · 📅 {o.data?.split('T')[0]}
                  </p>
                </div>
                <a href={o.link} target="_blank" rel="noreferrer" style={{
                  fontSize:12, color:'#5B0FBE', textDecoration:'none',
                  border:'1.5px solid #5B0FBE', padding:'5px 12px', borderRadius:8,
                  fontWeight:600, whiteSpace:'nowrap', marginLeft:12
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