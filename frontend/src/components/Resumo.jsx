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
          <h1 style={{fontSize:24, marginBottom:4}}>Resumo Executivo</h1>
          <p style={{color:'#888', fontSize:14}}>Gerado automaticamente em {hoje}</p>
        </div>
        <div style={{background:'#1a1a2e', color:'#4ade80', padding:'8px 20px', borderRadius:8, fontSize:13, fontWeight:700}}>
          🌿 GreenWatch — Motiva
        </div>
      </div>

      <div style={{background:'#fff', borderRadius:12, padding:28, marginBottom:24, boxShadow:'0 2px 8px #0001'}}>
        <h2 style={{fontSize:16, marginBottom:16, color:'#1a1a2e', borderBottom:'2px solid #f0f0f0', paddingBottom:12}}>
          Situação Geral — Rodoanel Mário Covas
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          {[
            { label: 'Extensão monitorada', value: '29,3 km' },
            { label: 'Trechos monitorados', value: resumo.total_trechos },
            { label: 'Trechos críticos', value: resumo.criticos },
            { label: 'Com crescimento ativo', value: resumo.com_crescimento },
            { label: 'Nível médio de vegetação', value: resumo.nivel_medio },
            { label: 'Conformidade contratual', value: `${conformidade.conformidade_geral}%` },
          ].map((item, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f5f5f5'}}>
              <span style={{color:'#666', fontSize:14}}>{item.label}</span>
              <span style={{fontWeight:700, fontSize:14}}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#fff', borderRadius:12, padding:28, marginBottom:24, boxShadow:'0 2px 8px #0001'}}>
        <h2 style={{fontSize:16, marginBottom:16, color:'#1a1a2e', borderBottom:'2px solid #f0f0f0', paddingBottom:12}}>
          Conformidade Contratual — ARTESP / ANTT
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          {[
            { label: 'Violações iminentes', value: conformidade.violacoes_iminentes, alerta: true },
            { label: 'Risco em 7 dias', value: conformidade.risco_em_7_dias, alerta: conformidade.risco_em_7_dias > 0 },
            { label: 'Base legal', value: 'ARTESP Anexo 6 + ANTT PER' },
            { label: 'Limite máximo', value: '30cm — faixa de domínio' },
          ].map((item, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f5f5f5'}}>
              <span style={{color:'#666', fontSize:14}}>{item.label}</span>
              <span style={{fontWeight:700, fontSize:14, color: item.alerta ? '#ef4444' : '#333'}}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#fff', borderRadius:12, padding:28, marginBottom:24, boxShadow:'0 2px 8px #0001'}}>
        <h2 style={{fontSize:16, marginBottom:16, color:'#1a1a2e', borderBottom:'2px solid #f0f0f0', paddingBottom:12}}>
          Ordens de Serviço Pendentes
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          {[
            { label: 'Total de ordens', value: ordens.length },
            { label: 'Urgentes (48h)', value: urgentes, alerta: urgentes > 0 },
            { label: 'Alta prioridade (7 dias)', value: altas },
            { label: 'Média prioridade (15 dias)', value: ordens.length - urgentes - altas },
          ].map((item, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f5f5f5'}}>
              <span style={{color:'#666', fontSize:14}}>{item.label}</span>
              <span style={{fontWeight:700, fontSize:14, color: item.alerta ? '#ef4444' : '#333'}}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#fff', borderRadius:12, padding:28, marginBottom:24, boxShadow:'0 2px 8px #0001'}}>
        <h2 style={{fontSize:16, marginBottom:16, color:'#1a1a2e', borderBottom:'2px solid #f0f0f0', paddingBottom:12}}>
          Status Ambiental — {new Date().toLocaleString('pt-BR', {month:'long'})}
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          {[
            { label: 'Nível de restrição', value: fauna.restricao.nivel },
            { label: 'Espécies monitoradas', value: fauna.total_especies_monitoradas },
            { label: 'Espécies em risco este mês', value: fauna.especies_em_risco.length },
            { label: 'Motivo', value: fauna.restricao.motivo },
          ].map((item, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f5f5f5'}}>
              <span style={{color:'#666', fontSize:14}}>{item.label}</span>
              <span style={{fontWeight:700, fontSize:14}}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#1a1a2e', borderRadius:12, padding:20, textAlign:'center'}}>
        <p style={{color:'#4ade80', fontSize:13, fontWeight:600}}>
          GreenWatch — Sistema Inteligente de Monitoramento de Vegetação
        </p>
        <p style={{color:'#ffffff55', fontSize:12, marginTop:4}}>
          Dados processados em tempo real · Challenge Motiva x FIAP 2026
        </p>
      </div>
    </div>
  );
}