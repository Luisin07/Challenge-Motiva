import React, { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Ordens() {
  const [ordens, setOrdens] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    fetch('http://localhost:8000/ordens').then(r => r.json()).then(setOrdens);
  }, []);

  if (!ordens.length) return <Loading />;

  const filtradas = filtro === 'TODOS' ? ordens : ordens.filter(o => o.prioridade === filtro);

  const exportarCSV = () => {
    const headers = ['KM','Area','Nivel Atual','Prioridade','Prazo','Metodo','Equipes','EPI'];
    const rows = filtradas.map(o => [
      o.observacao, o.area, o.nivel_atual, o.prioridade,
      o.prazo, o.metodo, o.equipes_necessarias, o.epi
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordens_servico_vegetrack.csv';
    a.click();
  };

  const TEMA = {
    'URGENTE': { bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', label: 'URGENTE', prazoColor: '#fca5a5' },
    'ALTA':    { bg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', label: 'ALTA', prazoColor: '#fdba74' },
    'MEDIA':   { bg: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)', label: 'MÉDIA', prazoColor: '#fde047' },
  };

  const urgentes = ordens.filter(o => o.prioridade === 'URGENTE').length;
  const altas = ordens.filter(o => o.prioridade === 'ALTA').length;

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h1 className="page-title">Ordens de Serviço</h1>
          <p className="page-subtitle">Geradas automaticamente com base nos dados reais</p>
        </div>
        <div style={{display:'flex', gap:12}}>
          <div style={{background:'#fef2f2', border:'1.5px solid #ef444433', borderRadius:12, padding:'12px 20px', textAlign:'center'}}>
            <p style={{fontSize:11, color:'#888', marginBottom:2, fontWeight:500}}>Urgentes</p>
            <p style={{fontSize:24, fontWeight:800, color:'#ef4444', lineHeight:1}}>{urgentes}</p>
          </div>
          <div style={{background:'#fff7ed', border:'1.5px solid #f9731633', borderRadius:12, padding:'12px 20px', textAlign:'center'}}>
            <p style={{fontSize:11, color:'#888', marginBottom:2, fontWeight:500}}>Alta</p>
            <p style={{fontSize:24, fontWeight:800, color:'#f97316', lineHeight:1}}>{altas}</p>
          </div>
        </div>
      </div>

      <div style={{display:'flex', gap:8, marginBottom:28, flexWrap:'wrap', alignItems:'center'}}>
        {['TODOS','URGENTE','ALTA','MEDIA'].map(f => (
          <button key={f} className={`filter-btn ${filtro === f ? 'ativo' : ''}`}
            onClick={() => setFiltro(f)}>
            {f === 'TODOS' ? 'Todas' : f}
          </button>
        ))}
        <span className="count-label">{filtradas.length} ordens</span>
        <button className="btn-primary" onClick={exportarCSV} style={{marginLeft:'auto'}}>
          ⬇ Exportar CSV
        </button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20}}>
        {filtradas.map((o, i) => {
          const tema = TEMA[o.prioridade];
          return (
            <div key={i} style={{
              borderRadius:18, overflow:'hidden',
              boxShadow:'0 4px 20px rgba(0,0,0,0.10)',
              background:'#fff'
            }}>
              <div style={{background: tema.bg, padding:'22px 24px 18px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <p style={{color:'#ffffff99', fontSize:11, fontWeight:600, letterSpacing:1, marginBottom:4}}>
                      ORDEM DE SERVIÇO
                    </p>
                    <p style={{color:'#fff', fontSize:20, fontWeight:800, letterSpacing:-0.3, lineHeight:1.2}}>
                      {o.observacao}
                    </p>
                  </div>
                  <span style={{
                    background:'#ffffff25', color:'#fff',
                    padding:'5px 12px', borderRadius:8,
                    fontSize:12, fontWeight:700, whiteSpace:'nowrap', marginLeft:12
                  }}>
                    {tema.label}
                  </span>
                </div>
                <p style={{color:'#ffffff99', fontSize:13, marginTop:8}}>{o.area}</p>
              </div>

              <div style={{padding:'20px 24px'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16}}>
                  {[
                    { label: 'PRAZO', value: o.prazo, icon: '⏱' },
                    { label: 'MÉTODO', value: o.metodo.replace('Roçada ',''), icon: '🌿' },
                    { label: 'EQUIPES', value: `${o.equipes_necessarias} equipe(s)`, icon: '👷' },
                  ].map((item, j) => (
                    <div key={j}>
                      <p style={{fontSize:10, color:'#aaa', fontWeight:600, letterSpacing:0.5, marginBottom:4}}>
                        {item.icon} {item.label}
                      </p>
                      <p style={{fontSize:15, fontWeight:700, color:'#1a1a2e'}}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{background:'#f5f5f7', borderRadius:10, padding:'10px 14px'}}>
                  <p style={{fontSize:10, color:'#aaa', fontWeight:600, letterSpacing:0.5, marginBottom:4}}>🦺 EPI OBRIGATÓRIO</p>
                  <p style={{fontSize:13, fontWeight:500, color:'#333'}}>{o.epi}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}