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

  const Secao = ({ titulo, itens }) => (
    <div className="card" style={{marginBottom:20}}>
      <h3 style={{fontSize:15, fontWeight:700, marginBottom:16, paddingBottom:12, borderBottom:'1px solid #f0f0f0'}}>
        {titulo}
      </h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:0}}>
        {itens.map((item, i) => (
          <div key={i} style={{
            display:'flex', justifyContent:'space-between',
            padding:'10px 0', borderBottom:'1px solid #f9f9f9'
          }}>
            <span style={{color:'#666', fontSize:14}}>{item.label}</span>
            <span style={{
              fontWeight:700, fontSize:14,
              color: item.alerta ? '#ef4444' : item.destaque ? '#6B21FF' : '#1a1a2e'
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
        <div>
          <h1 className="page-title">Resumo Executivo</h1>
          <p className="page-subtitle">Gerado automaticamente em {hoje}</p>
        </div>
        <span style={{
          background:'#6B21FF', color:'#fff',
          padding:'8px 16px', borderRadius:8,
          fontSize:13, fontWeight:700
        }}>
          VegeTrack
        </span>
      </div>

      <Secao titulo="Situação Geral — Rodoanel Mário Covas" itens={[
        { label: 'Extensão monitorada', value: '29,3 km', destaque: true },
        { label: 'Trechos monitorados', value: resumo.total_trechos },
        { label: 'Trechos críticos', value: resumo.criticos, alerta: resumo.criticos > 0 },
        { label: 'Com crescimento ativo', value: resumo.com_crescimento },
        { label: 'Nível médio de vegetação', value: resumo.nivel_medio },
        { label: 'Conformidade contratual', value: `${conformidade.conformidade_geral}%`, destaque: true },
      ]} />

      <Secao titulo="Conformidade Contratual — ARTESP / ANTT" itens={[
        { label: 'Violações iminentes', value: conformidade.violacoes_iminentes, alerta: conformidade.violacoes_iminentes > 0 },
        { label: 'Risco em 7 dias', value: conformidade.risco_em_7_dias, alerta: conformidade.risco_em_7_dias > 0 },
        { label: 'Base legal', value: 'ARTESP Anexo 6 + ANTT PER' },
        { label: 'Limite máximo', value: '30cm — faixa de domínio' },
      ]} />

      <Secao titulo="Ordens de Serviço Pendentes" itens={[
        { label: 'Total de ordens', value: ordens.length },
        { label: 'Urgentes (48h)', value: urgentes, alerta: urgentes > 0 },
        { label: 'Alta prioridade (7 dias)', value: altas },
        { label: 'Média prioridade (15 dias)', value: ordens.length - urgentes - altas },
      ]} />

      <Secao titulo={`Status Ambiental — ${new Date().toLocaleString('pt-BR', {month:'long'})}`} itens={[
        { label: 'Nível de restrição', value: fauna.restricao.nivel },
        { label: 'Espécies monitoradas', value: fauna.total_especies_monitoradas },
        { label: 'Espécies em risco este mês', value: fauna.especies_em_risco.length },
        { label: 'Motivo', value: fauna.restricao.motivo },
      ]} />

      <div style={{
        background:'#6B21FF', borderRadius:12, padding:20, textAlign:'center'
      }}>
        <p style={{color:'#fff', fontSize:13, fontWeight:700}}>
          VegeTrack — Sistema Inteligente de Monitoramento de Vegetação
        </p>
        <p style={{color:'#ffffff88', fontSize:12, marginTop:4}}>
          Dados processados em tempo real · Challenge Motiva x FIAP 2026
        </p>
      </div>
    </div>
  );
}