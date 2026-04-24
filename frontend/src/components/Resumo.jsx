import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function calcularIndice(conformidade, resumo, fauna) {
  let score = 100;

  // Conformidade abaixo de 95% penaliza bastante
  if (conformidade.conformidade_geral < 95) score -= 30;
  else if (conformidade.conformidade_geral < 98) score -= 15;

  // Trechos críticos (máx -20)
  score -= Math.min(resumo.criticos * 2, 20);

  // Trechos com crescimento (máx -15)
  score -= Math.min(resumo.com_crescimento, 15);

  // Status ambiental crítico ou alto
  if (fauna.restricao.nivel === 'CRITICO') score -= 10;
  else if (fauna.restricao.nivel === 'ALTO') score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getIndiceInfo(score) {
  if (score >= 80) return {
    label: 'Saudável',
    icone: '✅',
    cor: '#16a34a',
    accent: '#6ee7b7',
    bg: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
  };
  if (score >= 60) return {
    label: 'Zona de Atenção',
    icone: '⚠️',
    cor: '#ca8a04',
    accent: '#fde68a',
    bg: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
  };
  return {
    label: 'Situação Crítica',
    icone: '🚨',
    cor: '#ef4444',
    accent: '#fca5a5',
    bg: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
  };
}

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

  const indice = calcularIndice(conformidade, resumo, fauna);
  const indiceInfo = getIndiceInfo(indice);

  const URGENCIA_COR = {
    'ALTA':  { bg: '#fef2f2', border: '#ef4444', text: '#ef4444', badge: '#ef4444' },
    'MEDIA': { bg: '#fff7ed', border: '#f97316', text: '#f97316', badge: '#f97316' },
    'BAIXA': { bg: '#fefce8', border: '#ca8a04', text: '#ca8a04', badge: '#ca8a04' },
  };

  // Fatores que estão puxando o score para baixo
  const fatores = [];
  if (conformidade.violacoes_iminentes > 0) fatores.push(`${conformidade.violacoes_iminentes} violações iminentes ARTESP/ANTT`);
  if (resumo.criticos > 0) fatores.push(`${resumo.criticos} trechos em nível crítico (${((resumo.criticos / resumo.total_trechos) * 100).toFixed(1)}% do total)`);
  if (resumo.com_crescimento > 0) fatores.push(`${resumo.com_crescimento} trechos com vegetação crescendo`);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Resumo Executivo</h1>
          <p className="page-subtitle">Gerado automaticamente em {hoje}</p>
        </div>
      </div>

      {/* Índice de Saúde do Rodoanel */}
      <div style={{
        background: indiceInfo.bg,
        borderRadius: 14, marginBottom: 24,
        boxShadow: '0 2px 12px rgba(91,15,190,0.20)',
        overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: indiceInfo.accent + '15', pointerEvents: 'none' }} />

        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center' }}>
          {/* Score */}
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', textTransform: 'uppercase', marginBottom: 6 }}>
              ÍNDICE DE SAÚDE
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
              <span style={{ fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -2 }}>{indice}</span>
              <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff66' }}>/100</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 14 }}>{indiceInfo.icone}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: indiceInfo.accent }}>{indiceInfo.label}</span>
            </div>
          </div>

          {/* Divisor */}
          <div style={{ borderLeft: '1px solid #ffffff20', paddingLeft: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', textTransform: 'uppercase', marginBottom: 12 }}>
              FATORES DE IMPACTO
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fatores.length > 0 ? fatores.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: indiceInfo.accent, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#ffffffcc', fontWeight: 500 }}>{f}</p>
                </div>
              )) : (
                <p style={{ fontSize: 13, color: '#ffffffcc' }}>Nenhum fator crítico identificado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ height: 6, background: '#ffffff15' }}>
          <div style={{ height: '100%', width: `${indice}%`, background: indiceInfo.accent, transition: 'width 0.5s ease', borderRadius: '0 4px 4px 0' }} />
        </div>
      </div>

      {/* Alerta crítico */}
      {conformidade.violacoes_iminentes > 0 && (
        <div style={{
          background: '#fef2f2', border: '2px solid #ef4444',
          borderRadius: 16, padding: 20, marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <span style={{ fontSize: 28 }}>⚠️</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: '#ef4444' }}>
              {conformidade.violacoes_iminentes} violações iminentes — Intervenção em 48h
            </p>
            <p style={{ color: '#888', fontSize: 13, marginTop: 3 }}>
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

      {/* Previsão compacta */}
      {previsao.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>🔮 Previsão de Criticidade</h3>
              <p style={{ fontSize: 12, color: '#aaa' }}>Trechos que podem atingir nível crítico nos próximos dias</p>
            </div>
            <span style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #ef444433', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
              {previsao.filter(p => p.urgencia === 'ALTA').length} em alerta
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {previsao.map((p, i) => {
              const cor = URGENCIA_COR[p.urgencia] || URGENCIA_COR['BAIXA'];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: cor.bg, border: `1px solid ${cor.border}22`, borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ background: cor.badge, color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>KM {(p.km / 1000).toFixed(1).replace('.', '+')}</p>
                      <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{p.area}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, marginBottom: 2 }}>CRESCIMENTO</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: cor.text }}>+{p.crescimento_semanal}/semana</p>
                    </div>
                    <div style={{ background: cor.text, color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>
                      {p.dias_para_critico <= 7 ? `${p.dias_para_critico} dias` : `~${p.dias_para_critico}d`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 2px 12px rgba(91,15,190,0.20)' }}>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>VegeTrack — Sistema Inteligente de Monitoramento de Vegetação</p>
        <p style={{ color: '#ffffff88', fontSize: 12, marginTop: 6 }}>Dados processados em tempo real · Challenge Motiva x FIAP 2026</p>
      </div>
    </div>
  );
}
