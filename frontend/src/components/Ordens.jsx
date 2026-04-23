import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;

const NIVEL_COR = {
  'CRITICO': '#dc2626',
  'ALTO':    '#ea580c',
  'MODERADO':'#ca8a04',
  'BAIXO':   '#16a34a',
};

function getSegurancaInfo(temp, hora) {
  const calor_extremo = temp >= 35;
  const calor_alto = temp >= 32;
  const horario_critico = hora >= 11 && hora < 15;

  if (calor_extremo) {
    return {
      nivel: 'CRITICO',
      cor: '#dc2626',
      bg: '#fef2f2',
      icone: '🚨',
      titulo: 'Calor Extremo — Suspender Atividades',
      descricao: `${temp}°C · Temperatura acima de 35°C. NR-15 exige suspensão de trabalho externo.`,
      pausas: 'Pausas de 45min a cada 45min de trabalho. Hidratação obrigatória.',
      janela: 'Retomar apenas após as 16h ou quando temperatura baixar de 32°C.'
    };
  }
  if (calor_alto && horario_critico) {
    return {
      nivel: 'ALTO',
      cor: '#ea580c',
      bg: '#fff7ed',
      icone: '⚠️',
      titulo: 'Alerta de Calor — Horário Crítico',
      descricao: `${temp}°C · Horário de pico solar (11h–15h). Alto risco de insolação.`,
      pausas: 'Pausas de 30min a cada 1h. Água a cada 20 minutos.',
      janela: 'Preferir trabalho antes das 11h ou após as 15h.'
    };
  }
  if (calor_alto) {
    return {
      nivel: 'MODERADO',
      cor: '#ca8a04',
      bg: '#fefce8',
      icone: '🌡️',
      titulo: 'Atenção — Temperatura Elevada',
      descricao: `${temp}°C · Monitorar condição das equipes em campo.`,
      pausas: 'Pausas de 15min a cada 2h. Manter hidratação.',
      janela: 'Evitar exposição direta ao sol entre 11h e 15h.'
    };
  }
  return {
    nivel: 'BAIXO',
    cor: '#16a34a',
    bg: '#f0fdf4',
    icone: '✅',
    titulo: 'Condições Seguras',
    descricao: `${temp}°C · Temperatura dentro do limite seguro para trabalho externo.`,
    pausas: 'Pausas normais a cada 2h. Manter hidratação.',
    janela: 'Janela segura para operações em campo.'
  };
}

export default function Ordens({ filtroKm, onClear }) {
  const [ordens, setOrdens] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [alertaFauna, setAlertaFauna] = useState(null);
  const [alertaExpandido, setAlertaExpandido] = useState(false);
  const [clima, setClima] = useState(null);
  const [climaErro, setClimaErro] = useState(false);

  useEffect(() => {
    fetch(`${API}/ordens`).then(r => r.json()).then(setOrdens);
    fetch(`${API}/fauna/alerta`).then(r => r.json()).then(setAlertaFauna);

    // OpenWeatherMap — Osasco/SP (região do Rodoanel)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-23.5329&lon=-46.7920&appid=${WEATHER_KEY}&units=metric&lang=pt_br`)
      .then(r => r.json())
      .then(d => {
        if (d.cod === 200 || d.cod === undefined) {
          setClima({
            temp: Math.round(d.main.temp),
            sensacao: Math.round(d.main.feels_like),
            umidade: d.main.humidity,
            descricao: d.weather[0].description,
            vento: Math.round(d.wind.speed * 3.6),
            cidade: d.name,
          });
        } else {
          setClimaErro(true);
        }
      })
      .catch(() => setClimaErro(true));
  }, []);

  const exportarCSV = () => {
    const headers = ['KM', 'Area', 'Nivel Atual', 'Prioridade', 'Prazo', 'Metodo', 'Equipes', 'EPI'];
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

  if (!ordens.length) return <Loading />;

  let filtradas = filtro === 'TODOS' ? ordens : ordens.filter(o => o.prioridade === filtro);
  if (filtroKm !== null && filtroKm !== undefined) {
    if (filtroKm === 3) filtradas = filtradas.filter(o => o.prioridade === 'URGENTE');
    else if (filtroKm === 2) filtradas = filtradas.filter(o => o.prioridade === 'ALTA');
  }

  const TEMA = {
    'URGENTE': { bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', label: 'URGENTE' },
    'ALTA':    { bg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', label: 'ALTA' },
    'MEDIA':   { bg: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)', label: 'MÉDIA' },
  };

  const urgentes = ordens.filter(o => o.prioridade === 'URGENTE').length;
  const altas = ordens.filter(o => o.prioridade === 'ALTA').length;
  const corFauna = alertaFauna ? NIVEL_COR[alertaFauna.nivel] || '#ca8a04' : null;

  const horaAtual = new Date().getHours();
  const seguranca = clima ? getSegurancaInfo(clima.temp, horaAtual) : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Ordens de Serviço</h1>
          <p className="page-subtitle">Geradas automaticamente com base nos dados reais</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: '#fef2f2', border: '1.5px solid #ef444433', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#888', marginBottom: 2, fontWeight: 500 }}>Urgentes</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>{urgentes}</p>
          </div>
          <div style={{ background: '#fff7ed', border: '1.5px solid #f9731633', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#888', marginBottom: 2, fontWeight: 500 }}>Alta</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#f97316', lineHeight: 1 }}>{altas}</p>
          </div>
        </div>
      </div>

      {/* Módulo de Segurança do Trabalhador */}
      {clima && seguranca && (
        <div style={{
          background: seguranca.bg,
          border: `1.5px solid ${seguranca.cor}33`,
          borderRadius: 14, marginBottom: 20, overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: seguranca.cor,
            padding: '10px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{seguranca.icone}</span>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{seguranca.titulo}</p>
            </div>
            <span style={{ color: '#ffffff99', fontSize: 11 }}>
              Segurança do Trabalhador · {clima.cidade} · Agora
            </span>
          </div>

          {/* Corpo */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'start' }}>

              {/* Dados climáticos */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 42, fontWeight: 800, color: seguranca.cor, lineHeight: 1 }}>{clima.temp}°</p>
                  <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{clima.descricao}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Sensação', value: `${clima.sensacao}°C` },
                    { label: 'Umidade', value: `${clima.umidade}%` },
                    { label: 'Vento', value: `${clima.vento} km/h` },
                  ].map((item, i) => (
                    <div key={i}>
                      <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600 }}>{item.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas e recomendações */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', borderLeft: `3px solid ${seguranca.cor}` }}>
                  <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, marginBottom: 3 }}>🕐 JANELA DE TRABALHO</p>
                  <p style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>{seguranca.janela}</p>
                </div>
                <div style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', borderLeft: `3px solid ${seguranca.cor}` }}>
                  <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, marginBottom: 3 }}>💧 PAUSAS E HIDRATAÇÃO — NR-15</p>
                  <p style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>{seguranca.pausas}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {climaErro && (
        <div style={{
          background: '#f5f5f7', borderRadius: 12, padding: '12px 18px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 16 }}>🌤️</span>
          <p style={{ fontSize: 12, color: '#888' }}>Dados climáticos indisponíveis no momento.</p>
        </div>
      )}

      {/* Banner de alerta ambiental */}
      {alertaFauna && alertaFauna.alerta && (
        <div style={{
          background: corFauna + '10',
          border: `2px solid ${corFauna}`,
          borderRadius: 14, marginBottom: 20, overflow: 'hidden'
        }}>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer' }}
            onClick={() => setAlertaExpandido(!alertaExpandido)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>🦎</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, color: corFauna }}>
                  Alerta Ambiental — Restrição {alertaFauna.nivel}
                </p>
                <p style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{alertaFauna.motivo}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: corFauna, color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                {alertaFauna.especies_afetadas?.length || 0} espécies
              </span>
              <span style={{ color: corFauna, fontSize: 18, fontWeight: 700 }}>
                {alertaExpandido ? '▲' : '▼'}
              </span>
            </div>
          </div>

          {alertaExpandido && (
            <div style={{ padding: '0 20px 16px', borderTop: `1px solid ${corFauna}33` }}>
              <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>
                    🐾 ESPÉCIES EM PERÍODO DE RISCO
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {alertaFauna.especies_afetadas?.map((e, i) => (
                      <span key={i} style={{
                        background: corFauna + '15', border: `1px solid ${corFauna}`,
                        color: corFauna, padding: '4px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700
                      }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>
                    ✅ RECOMENDAÇÕES PARA AS EQUIPES
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {alertaFauna.recomendacoes?.map((r, i) => (
                      <div key={i} style={{
                        background: '#fff', borderRadius: 8, padding: '8px 12px',
                        fontSize: 12, color: '#444', borderLeft: `3px solid ${corFauna}`
                      }}>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
        {['TODOS', 'URGENTE', 'ALTA', 'MEDIA'].map(f => (
          <button key={f} className={`filter-btn ${filtro === f ? 'ativo' : ''}`}
            onClick={() => { setFiltro(f); if (onClear) onClear(); }}>
            {f === 'TODOS' ? 'Todas' : f}
          </button>
        ))}
        <span className="count-label">{filtradas.length} ordens</span>
        {filtroKm && (
          <button onClick={() => { if (onClear) onClear(); setFiltro('TODOS'); }} style={{
            background: '#f0f0f0', border: 'none', borderRadius: 8,
            padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#555'
          }}>
            ✕ Limpar filtro do mapa
          </button>
        )}
        <button className="btn-primary" onClick={exportarCSV} style={{ marginLeft: 'auto' }}>
          ⬇ Exportar CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
        {filtradas.map((o, i) => {
          const tema = TEMA[o.prioridade];
          return (
            <div key={i} style={{
              borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
              background: '#fff'
            }}>
              <div style={{ background: tema.bg, padding: '22px 24px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#ffffff99', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>
                      ORDEM DE SERVIÇO
                    </p>
                    <p style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2 }}>
                      {o.observacao}
                    </p>
                  </div>
                  <span style={{
                    background: '#ffffff25', color: '#fff',
                    padding: '5px 12px', borderRadius: 8,
                    fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12
                  }}>
                    {tema.label}
                  </span>
                </div>
                <p style={{ color: '#ffffff99', fontSize: 13, marginTop: 8 }}>{o.area}</p>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                  {[
                    { label: 'PRAZO', value: o.prazo, icon: '⏱' },
                    { label: 'MÉTODO', value: o.metodo.replace('Roçada ', ''), icon: '🌿' },
                    { label: 'EQUIPES', value: `${o.equipes_necessarias} equipe(s)`, icon: '👷' },
                  ].map((item, j) => (
                    <div key={j}>
                      <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>
                        {item.icon} {item.label}
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f5f5f7', borderRadius: 10, padding: '10px 14px' }}>
                  <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>🦺 EPI OBRIGATÓRIO</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{o.epi}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
