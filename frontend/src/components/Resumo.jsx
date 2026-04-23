import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Resumo() {
  const [resumo, setResumo] = useState(null);
  const [conformidade, setConformidade] = useState(null);
  const [ordens, setOrdens] = useState([]);
  const [fauna, setFauna] = useState(null);
  const [previsao, setPrevisao] = useState([]);

  useEffect(() => {
    fetch(`${API}/resumo`).then(r => r.json()).then(setResumo);
    fetch(`${API}/conformidade`).then(r => r.json()).then(setConformidade);
    fetch(`${API}/ordens`).then(r => r.json()).then(setOrdens);
    fetch(`${API}/fauna/status`).then(r => r.json()).then(setFauna);
    fetch(`${API}/previsao`).then(r => r.json()).then(data => setPrevisao(data.slice(0, 5)));
  }, []);

  if (!resumo || !conformidade || !fauna) return <Loading />;

  const urgentes = ordens.filter(o => o.prioridade === 'URGENTE').length;
  const altas = ordens.filter(o => o.prioridade === 'ALTA').length;
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const URGENCIA_COR = {
    'ALTA':  { bg: '#fef2f2', border: '#ef4444', text: '#ef4444', badge: '#ef4444' },
    'MEDIA': { bg: '#fff7ed', border: '#f97316', text: '#f97316', badge: '#f97316' },
    'BAIXA': { bg: '#fefce8', border: '#ca8a04', text: '#ca8a04', badge: '#ca8a04' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Resumo Executivo</h1>
          <p className="page-subtitle">Gerado automaticamente em {hoje}</p>
        </div>
        
      </div>

      {/* Alerta crítico */}
      {conformidade.violacoes_iminentes > 0 && (
        <div style={{
          background: '#fef2f2', border: '2px solid #ef4444',
          borderRadius: 16, padding: 24, marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 20
        }}>
          <span style={{ fontSize: 36 }}>⚠️</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: 18, color: '#ef4444' }}>
              {conformidade.violacoes_iminentes} violações iminentes — Intervenção em 48h
            </p>
            <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
              Trechos com vegetação acima do limite ARTESP/ANTT. Risco de multa contratual.
            </p>
          </div>
        </div>
      )}

      {/* Cards principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Conformidade', value: `${conformidade.conformidade_geral}%`, bg: '#f0fdf4', cor: '#16a34a', desc: 'Geral ARTESP/ANTT' },
          { label: 'Trechos Críticos', value: resumo.criticos, bg: '#fef2f2', cor: '#ef4444', desc: 'Requerem intervenção' },
          { label: 'Ordens Urgentes', value: urgentes, bg: '#fef2f2', cor: '#ef4444', desc: 'Prazo 48 horas' },
          { label: 'Com Crescimento', value: resumo.com_crescimento, bg: '#fefce8', cor: '#ca8a04', desc: 'Vegetação aumentando' },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 16, padding: 24, border: `1px solid ${c.cor}22` }}>
            <p style={{ color: '#888', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>{c.label}</p>
            <p style={{ fontSize: 40, fontWeight: 800, color: c.cor, lineHeight: 1 }}>{c.value}</p>
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Duas colunas de detalhes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>Situação Geral</h3>
          {[
            { label: 'Extensão monitorada', value: '29,3 km' },
            { label: 'Trechos monitorados', value: resumo.total_trechos },
            { label: 'Nível médio vegetação', value: resumo.nivel_medio },
            { label: 'Total ordens de serviço', value: ordens.length },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ color: '#666', fontSize: 13 }}>{item.label}</span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>Ordens de Serviço</h3>
          {[
            { label: 'Urgentes (48h)', value: urgentes, alerta: urgentes > 0 },
            { label: 'Alta prioridade (7 dias)', value: altas },
            { label: 'Média prioridade (15 dias)', value: ordens.length - urgentes - altas },
            { label: 'Status ambiental', value: fauna.restricao.nivel },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ color: '#666', fontSize: 13 }}>{item.label}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: item.alerta ? '#ef4444' : '#1a1a2e' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Previsão compacta — top 5 trechos críticos em até 7 dias */}
      {previsao.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>
                🔮 Previsão de Criticidade
              </h3>
              <p style={{ fontSize: 12, color: '#aaa' }}>Trechos que podem atingir nível crítico nos próximos dias</p>
            </div>
            <span style={{
              background: '#fef2f2', color: '#ef4444',
              border: '1px solid #ef444433',
              padding: '4px 12px', borderRadius: 8,
              fontSize: 12, fontWeight: 700
            }}>
              {previsao.filter(p => p.urgencia === 'ALTA').length} em alerta
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {previsao.map((p, i) => {
              const cor = URGENCIA_COR[p.urgencia] || URGENCIA_COR['BAIXA'];
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: cor.bg, border: `1px solid ${cor.border}22`,
                  borderRadius: 12, padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      background: cor.badge, color: '#fff',
                      width: 28, height: 28, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, flexShrink: 0
                    }}>
                      {i + 1}
                    </span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>
                        KM {(p.km / 1000).toFixed(1).replace('.', '+')}
                      </p>
                      <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{p.area}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, marginBottom: 2 }}>CRESCIMENTO</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: cor.text }}>+{p.crescimento_semanal}/semana</p>
                    </div>
                    <div style={{
                      background: cor.text, color: '#fff',
                      padding: '6px 14px', borderRadius: 8,
                      fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap'
                    }}>
                      {p.dias_para_critico <= 7 ? `${p.dias_para_critico} dias` : `~${p.dias_para_critico}d`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ background: '#5B0FBE', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>VegeTrack — Sistema Inteligente de Monitoramento de Vegetação</p>
        <p style={{ color: '#ffffff88', fontSize: 12, marginTop: 6 }}>Dados processados em tempo real · Challenge Motiva x FIAP 2026</p>
      </div>
    </div>
  );
}
