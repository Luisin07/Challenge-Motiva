import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function calcularIndice(conformidade, resumo, fauna) {
  let score = 100;
  if (conformidade.conformidade_geral < 95) score -= 30;
  else if (conformidade.conformidade_geral < 98) score -= 15;
  score -= Math.min(resumo.criticos * 2, 20);
  score -= Math.min(resumo.com_crescimento, 15);
  if (fauna.restricao.nivel === 'CRITICO') score -= 10;
  else if (fauna.restricao.nivel === 'ALTO') score -= 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getIndiceInfo(score) {
  if (score >= 80) return { label: 'Saudável', icone: '✅', accent: '#6ee7b7', corRGB: [22, 163, 74] };
  if (score >= 60) return { label: 'Zona de Atenção', icone: '⚠️', accent: '#fde68a', corRGB: [202, 138, 4] };
  return { label: 'Situação Crítica', icone: '🚨', accent: '#fca5a5', corRGB: [220, 38, 38] };
}

async function gerarPDF(dados) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { resumo, conformidade, ordens, fauna, indice, indiceInfo, hoje } = dados;
  const urgentes = ordens.filter(o => o.prioridade === 'URGENTE');
  const altas = ordens.filter(o => o.prioridade === 'ALTA');

  const W = 210;
  const roxo = [91, 15, 190];
  const roxoEscuro = [59, 15, 140];
  const branco = [255, 255, 255];
  const cinza1 = [248, 248, 250];
  const cinza2 = [240, 240, 245];
  const cinzaTexto = [80, 80, 100];
  const cinzaLabel = [150, 150, 170];
  const vermelho = [220, 38, 38];
  const verde = [22, 163, 74];

  // ── CABEÇALHO ──
  doc.setFillColor(...roxoEscuro);
  doc.rect(0, 0, W, 45, 'F');
  // Faixa accent
  doc.setFillColor(...roxo);
  doc.rect(0, 38, W, 7, 'F');
  // Linha decorativa
  doc.setFillColor(161, 100, 255);
  doc.rect(0, 38, 60, 7, 'F');

  doc.setTextColor(...branco);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('VegeTrack', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 180, 255);
  doc.text('Sistema Inteligente de Monitoramento de Vegetacao', 14, 27);
  doc.text('Rodoanel Mario Covas (SP-021)  —  Challenge Motiva x FIAP 2026', 14, 33);

  doc.setTextColor(...branco);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATORIO DE CONFORMIDADE', W - 14, 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 180, 255);
  doc.setFontSize(8);
  doc.text(`Emitido em: ${hoje}`, W - 14, 27, { align: 'right' });
  doc.text('Documento oficial — uso interno', W - 14, 33, { align: 'right' });

  let y = 55;

  // ── ÍNDICE DE SAÚDE ──
  doc.setFillColor(...cinza1);
  doc.roundedRect(14, y, W - 28, 38, 3, 3, 'F');
  doc.setFillColor(...roxo);
  doc.rect(14, y, 4, 38, 'F');

  // Score
  doc.setFontSize(42);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...roxo);
  doc.text(String(indice), 26, y + 22);

  doc.setFontSize(12);
  doc.setTextColor(...cinzaTexto);
  doc.text('/100', 26 + doc.getTextWidth(String(indice)) + 2, y + 22);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...indiceInfo.corRGB);
  doc.text(indiceInfo.label, 26, y + 31);

  // Divisor vertical
  doc.setDrawColor(...cinza2);
  doc.setLineWidth(0.5);
  doc.line(80, y + 6, 80, y + 32);

  // Label
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cinzaLabel);
  doc.text('INDICE DE SAUDE DO RODOANEL', 84, y + 8);

  // Métricas rápidas
  const metrRapidas = [
    [`Conformidade: ${conformidade.conformidade_geral}%`, conformidade.conformidade_geral >= 95 ? verde : vermelho],
    [`Trechos criticos: ${resumo.criticos} / ${resumo.total_trechos}`, vermelho],
    [`Com crescimento: ${resumo.com_crescimento} trechos`, [202, 138, 4]],
    [`Status ambiental: ${fauna.restricao.nivel}`, cinzaTexto],
  ];
  metrRapidas.forEach(([txt, cor], i) => {
    const col = i < 2 ? 84 : 148;
    const row = i < 2 ? y + 16 + (i * 9) : y + 16 + ((i - 2) * 9);
    doc.setFontSize(9);
    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
    doc.setTextColor(...cor);
    doc.text(txt, col, row);
  });

  // Barra de progresso
  doc.setFillColor(...cinza2);
  doc.roundedRect(14, y + 35, W - 28, 3, 1, 1, 'F');
  doc.setFillColor(...indiceInfo.corRGB);
  doc.roundedRect(14, y + 35, ((W - 28) * indice) / 100, 3, 1, 1, 'F');

  y += 48;

  // ── RESUMO EXECUTIVO ──
  doc.setFillColor(...roxo);
  doc.rect(14, y, W - 28, 7, 'F');
  doc.setTextColor(...branco);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO EXECUTIVO', 17, y + 5);
  y += 7;

  const metricas = [
    ['Extensao monitorada', '29,3 km'],
    ['Trechos monitorados', String(resumo.total_trechos)],
    ['Nivel medio de vegetacao', String(resumo.nivel_medio)],
    ['Violacoes iminentes (ARTESP/ANTT)', String(conformidade.violacoes_iminentes)],
    ['Risco em 7 dias', String(conformidade.risco_em_7_dias)],
    ['Ordens urgentes (48h)', String(urgentes.length)],
    ['Ordens alta prioridade (7 dias)', String(altas.length)],
    ['Status ambiental', fauna.restricao.nivel],
  ];

  metricas.forEach(([label, valor], i) => {
    doc.setFillColor(...(i % 2 === 0 ? cinza1 : branco));
    doc.rect(14, y, W - 28, 8, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cinzaTexto);
    doc.text(label, 17, y + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...roxo);
    doc.text(valor, W - 16, y + 5.5, { align: 'right' });
    y += 8;
  });

  y += 8;

  // ── VIOLAÇÕES IMINENTES ──
  doc.setFillColor(...roxo);
  doc.rect(14, y, W - 28, 7, 'F');
  doc.setTextColor(...branco);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('VIOLACOES IMINENTES — ARTESP/ANTT', 17, y + 5);
  doc.text(String(conformidade.violacoes_iminentes), W - 16, y + 5, { align: 'right' });
  y += 7;

  doc.setFillColor(254, 242, 242);
  doc.rect(14, y, W - 28, 8, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...vermelho);
  doc.text('Vegetacao acima do limite de 30cm. Intervencao obrigatoria em ate 48 horas para evitar infracao ARTESP/ANTT.', 17, y + 5.5);
  y += 8;

  // Header tabela violações
  doc.setFillColor(...cinza2);
  doc.rect(14, y, W - 28, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cinzaTexto);
  doc.text('KM', 17, y + 5);
  doc.text('AREA', 38, y + 5);
  doc.text('SITUACAO', 115, y + 5);
  doc.text('PRAZO', 163, y + 5);
  doc.text('MULTA', W - 16, y + 5, { align: 'right' });
  y += 7;

  const violacoes = conformidade.trechos.filter(t => t.situacao === 'VIOLACAO IMINENTE');
  violacoes.slice(0, 13).forEach((t, i) => {
    doc.setFillColor(...(i % 2 === 0 ? cinza1 : branco));
    doc.rect(14, y, W - 28, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cinzaTexto);
    const km = (t.km / 1000).toFixed(1).replace('.', '+');
    doc.text(`KM ${km}`, 17, y + 5);
    doc.text(t.area.replace('Canteiro ', ''), 38, y + 5);
    doc.setTextColor(...vermelho);
    doc.setFont('helvetica', 'bold');
    doc.text(t.situacao, 115, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cinzaTexto);
    doc.text(t.prazo_legal, 163, y + 5);
    doc.setTextColor(...vermelho);
    doc.setFont('helvetica', 'bold');
    doc.text(t.risco_multa, W - 16, y + 5, { align: 'right' });
    y += 7;
  });

  y += 8;

  // Nova página se necessário
  if (y > 230) { doc.addPage(); y = 20; }

  // ── ORDENS URGENTES ──
  doc.setFillColor(...roxo);
  doc.rect(14, y, W - 28, 7, 'F');
  doc.setTextColor(...branco);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDENS DE SERVICO URGENTES (48H)', 17, y + 5);
  doc.text(String(urgentes.length), W - 16, y + 5, { align: 'right' });
  y += 7;

  // Header tabela ordens
  doc.setFillColor(...cinza2);
  doc.rect(14, y, W - 28, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cinzaTexto);
  doc.text('KM', 17, y + 5);
  doc.text('AREA', 38, y + 5);
  doc.text('METODO', 100, y + 5);
  doc.text('EQUIPES', 148, y + 5);
  doc.text('EPI', 168, y + 5);
  y += 7;

  urgentes.slice(0, 13).forEach((o, i) => {
    doc.setFillColor(...(i % 2 === 0 ? cinza1 : branco));
    doc.rect(14, y, W - 28, 7, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cinzaTexto);
    const km = (o.km / 1000).toFixed(1).replace('.', '+');
    doc.text(`KM ${km}`, 17, y + 5);
    doc.text(o.area.replace('Canteiro ', '').substring(0, 28), 38, y + 5);
    doc.text(o.metodo.replace('Rocada ', ''), 100, y + 5);
    doc.text(`${o.equipes_necessarias} equipe(s)`, 148, y + 5);
    doc.text(o.epi.substring(0, 22), 168, y + 5);
    y += 7;
  });

  // ── RODAPÉ ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...roxoEscuro);
    doc.rect(0, 280, W, 17, 'F');
    doc.setFillColor(...roxo);
    doc.rect(0, 280, 50, 17, 'F');
    doc.setTextColor(...branco);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('VegeTrack', 5, 287);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(200, 180, 255);
    doc.text('Challenge Motiva x FIAP 2026', 5, 292);
    doc.setTextColor(...branco);
    doc.text('Base legal: ARTESP Anexo 6 + ANTT PER — limite maximo 30cm faixa de dominio', 55, 287);
    doc.setTextColor(200, 180, 255);
    doc.text(`Pagina ${i} de ${totalPages}  |  Documento gerado automaticamente pelo VegeTrack`, 55, 292);
  }

  doc.save(`VegeTrack_Conformidade_${new Date().toISOString().split('T')[0]}.pdf`);
}

export default function Resumo() {
  const [resumo, setResumo] = useState(null);
  const [conformidade, setConformidade] = useState(null);
  const [ordens, setOrdens] = useState([]);
  const [fauna, setFauna] = useState(null);
  const [previsao, setPrevisao] = useState([]);
  const [gerando, setGerando] = useState(false);

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

  const fatores = [];
  if (conformidade.violacoes_iminentes > 0) fatores.push(`${conformidade.violacoes_iminentes} violações iminentes ARTESP/ANTT`);
  if (resumo.criticos > 0) fatores.push(`${resumo.criticos} trechos em nível crítico (${((resumo.criticos / resumo.total_trechos) * 100).toFixed(1)}% do total)`);
  if (resumo.com_crescimento > 0) fatores.push(`${resumo.com_crescimento} trechos com vegetação crescendo`);

  const URGENCIA_COR = {
    'ALTA':  { bg: '#fef2f2', border: '#ef4444', text: '#ef4444', badge: '#ef4444' },
    'MEDIA': { bg: '#fff7ed', border: '#f97316', text: '#f97316', badge: '#f97316' },
    'BAIXA': { bg: '#fefce8', border: '#ca8a04', text: '#ca8a04', badge: '#ca8a04' },
  };

  const cards = [
    { label: 'CONFORMIDADE', value: conformidade.conformidade_geral, unit: '%', sub: 'Geral ARTESP/ANTT', accent: conformidade.conformidade_geral >= 95 ? '#6ee7b7' : '#fca5a5', trend: conformidade.conformidade_geral >= 95 ? '● dentro do limite' : '▼ abaixo do alvo', trendColor: conformidade.conformidade_geral >= 95 ? '#6ee7b7' : '#fca5a5' },
    { label: 'TRECHOS CRÍTICOS', value: resumo.criticos, unit: null, sub: 'Requerem intervenção', accent: '#fca5a5', trend: '▲ em alta', trendColor: '#fca5a5' },
    { label: 'ORDENS URGENTES', value: urgentes, unit: null, sub: 'Prazo 48 horas', accent: '#fca5a5', trend: urgentes > 0 ? '▲ ação necessária' : '● ok', trendColor: urgentes > 0 ? '#fca5a5' : '#6ee7b7' },
    { label: 'COM CRESCIMENTO', value: resumo.com_crescimento, unit: null, sub: 'Vegetação aumentando', accent: '#fde68a', trend: '▲ monitorar', trendColor: '#fde68a' },
  ];

  const handleGerarPDF = async () => {
    setGerando(true);
    try {
      await gerarPDF({ resumo, conformidade, ordens, fauna, indice, indiceInfo, hoje });
    } finally {
      setGerando(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Resumo Executivo</h1>
          <p className="page-subtitle">Gerado automaticamente em {hoje}</p>
        </div>
        {/* Botão refinado — outline roxo */}
        <button
          onClick={handleGerarPDF}
          disabled={gerando}
          style={{
            background: gerando ? 'transparent' : '#fff',
            color: gerando ? '#a78bfa' : '#5B0FBE',
            border: `2px solid ${gerando ? '#a78bfa' : '#5B0FBE'}`,
            borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 700,
            cursor: gerando ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.15s',
            letterSpacing: 0.3,
          }}
          onMouseEnter={e => { if (!gerando) { e.currentTarget.style.background = '#5B0FBE'; e.currentTarget.style.color = '#fff'; } }}
          onMouseLeave={e => { if (!gerando) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#5B0FBE'; } }}
        >
          {gerando ? '⏳ Gerando PDF...' : '📄 Exportar Relatório PDF'}
        </button>
      </div>

      {/* Índice de Saúde */}
      <div style={{
        background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
        borderRadius: 14, marginBottom: 24,
        boxShadow: '0 2px 12px rgba(91,15,190,0.20)',
        overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: indiceInfo.accent + '15', pointerEvents: 'none' }} />
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', textTransform: 'uppercase', marginBottom: 6 }}>ÍNDICE DE SAÚDE</p>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
              <span style={{ fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -2 }}>{indice}</span>
              <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff66' }}>/100</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 14 }}>{indiceInfo.icone}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: indiceInfo.accent }}>{indiceInfo.label}</span>
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #ffffff20', paddingLeft: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', textTransform: 'uppercase', marginBottom: 12 }}>FATORES DE IMPACTO</p>
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
        <div style={{ height: 6, background: '#ffffff15' }}>
          <div style={{ height: '100%', width: `${indice}%`, background: indiceInfo.accent, borderRadius: '0 4px 4px 0' }} />
        </div>
      </div>

      {/* Cards BI Motiva */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: 'linear-gradient(145deg, #3b0f8c 0%, #5B0FBE 100%)',
            borderRadius: 14, padding: '18px 20px 16px',
            boxShadow: '0 2px 12px rgba(91,15,190,0.20)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 72, height: 72, borderRadius: '50%', background: c.accent + '20', pointerEvents: 'none' }} />
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff66', marginBottom: 12, textTransform: 'uppercase' }}>{c.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>{c.value}</span>
              {c.unit && <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffffbb' }}>{c.unit}</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 11, color: '#ffffff55' }}>{c.sub}</p>
              <span style={{ fontSize: 10, fontWeight: 700, color: c.trendColor, whiteSpace: 'nowrap', marginLeft: 6 }}>{c.trend}</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: c.accent, opacity: 0.8 }} />
          </div>
        ))}
      </div>

      {/* Duas colunas */}
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

      {/* Previsão */}
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
