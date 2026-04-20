import React, { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Resumo() {
  const [resumo, setResumo] = useState(null);
  const [conformidade, setConformidade] = useState(null);
  const [ordens, setOrdens] = useState([]);
  const [fauna, setFauna] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/resumo').then(r => r.json()).then(setResumo);
    fetch('http://localhost:8000/conformidade').then(r => r.json()).then(setConformidade);
    fetch('http://localhost:8000/ordens').then(r => r.json()).then(setOrdens);
    fetch('http://localhost:8000/fauna/status').then(r => r.json()).then(setFauna);
  }, []);

  if (!resumo || !conformidade || !fauna) return <Loading />;

  const urgentes = ordens.filter(o => o.prioridade === 'URGENTE').length;
  const altas = ordens.filter(o => o.prioridade === 'ALTA').length;
  const hoje = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32}}>
        <div>
          <h1 className="page-title">Resumo Executivo</h1>
          <p className="page-subtitle">Gerado automaticamente em {hoje}</p>
        </div>
        <span style={{background:'#5B0FBE', color:'#fff', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:700}}>
          VegeTrack
        </span>
      </div>

      {/* Alertas críticos em destaque */}
      {conformidade.violacoes_iminentes > 0 && (
        <div style={{
          background:'#fef2f2', border:'2px solid #ef4444',
          borderRadius:16, padding:24, marginBottom:24,
          display:'flex', alignItems:'center', gap:20
        }}>
          <span style={{fontSize:36}}>⚠️</span>
          <div>
            <p style={{fontWeight:800, fontSize:18, color:'#ef4444'}}>
              {conformidade.violacoes_iminentes} violações iminentes — Intervenção em 48h
            </p>
            <p style={{color:'#888', fontSize:14, marginTop:4}}>
              Trechos com vegetação acima do limite ARTESP/ANTT. Risco de multa contratual.
            </p>
          </div>
        </div>
      )}

      {/* Cards principais */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24}}>
        {[
          { label: 'Conformidade', value: `${conformidade.conformidade_geral}%`, bg:'#f0fdf4', cor:'#16a34a', desc:'Geral ARTESP/ANTT' },
          { label: 'Trechos Críticos', value: resumo.criticos, bg:'#fef2f2', cor:'#ef4444', desc:'Requerem intervenção' },
          { label: 'Ordens Urgentes', value: urgentes, bg:'#fef2f2', cor:'#ef4444', desc:'Prazo 48 horas' },
          { label: 'Com Crescimento', value: resumo.com_crescimento, bg:'#fefce8', cor:'#ca8a04', desc:'Vegetação aumentando' },
        ].map((c, i) => (
          <div key={i} style={{background:c.bg, borderRadius:16, padding:24, border:`1px solid ${c.cor}22`}}>
            <p style={{color:'#888', fontSize:12, fontWeight:500, marginBottom:8}}>{c.label}</p>
            <p style={{fontSize:40, fontWeight:800, color:c.cor, lineHeight:1}}>{c.value}</p>
            <p style={{color:'#aaa', fontSize:12, marginTop:8}}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Duas colunas de detalhes */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24}}>
        <div style={{background:'#fff', borderRadius:16, padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
          <h3 style={{fontSize:14, fontWeight:700, marginBottom:16, color:'#1a1a2e'}}>Situação Geral</h3>
          {[
            { label: 'Extensão monitorada', value: '29,3 km' },
            { label: 'Trechos monitorados', value: resumo.total_trechos },
            { label: 'Nível médio vegetação', value: resumo.nivel_medio },
            { label: 'Total ordens de serviço', value: ordens.length },
          ].map((item, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f5f5f5'}}>
              <span style={{color:'#666', fontSize:13}}>{item.label}</span>
              <span style={{fontWeight:700, fontSize:13}}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{background:'#fff', borderRadius:16, padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
          <h3 style={{fontSize:14, fontWeight:700, marginBottom:16, color:'#1a1a2e'}}>Ordens de Serviço</h3>
          {[
            { label: 'Urgentes (48h)', value: urgentes, alerta: urgentes > 0 },
            { label: 'Alta prioridade (7 dias)', value: altas },
            { label: 'Média prioridade (15 dias)', value: ordens.length - urgentes - altas },
            { label: 'Status ambiental', value: fauna.restricao.nivel },
          ].map((item, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f5f5f5'}}>
              <span style={{color:'#666', fontSize:13}}>{item.label}</span>
              <span style={{fontWeight:700, fontSize:13, color: item.alerta ? '#ef4444' : '#1a1a2e'}}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#5B0FBE', borderRadius:16, padding:24, textAlign:'center'}}>
        <p style={{color:'#fff', fontSize:14, fontWeight:700}}>VegeTrack — Sistema Inteligente de Monitoramento de Vegetação</p>
        <p style={{color:'#ffffff88', fontSize:12, marginTop:6}}>Dados processados em tempo real · Challenge Motiva x FIAP 2026</p>
      </div>
    </div>
  );
}