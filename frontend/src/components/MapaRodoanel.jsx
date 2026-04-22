import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Loading from './Loading';

export default function MapaRodoanel() {
  const [trechos, setTrechos] = useState([]);
  const [marcos, setMarcos] = useState([]);
  const [criticos, setCriticos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/mapa/trechos').then(r => r.json()),
      fetch('http://localhost:8000/mapa/marcos').then(r => r.json()),
      fetch('http://localhost:8000/criticos').then(r => r.json()),
    ]).then(([t, m, c]) => {
      setTrechos(t);
      setMarcos(m);
      setCriticos(c);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  const getCriticoInfo = (center) => {
    if (!center) return null;
    const km = center[0];
    const lng = center[1];
    return criticos.find(c => {
      const kmTrecho = c.km / 1000;
      return Math.abs(kmTrecho - Math.abs(km)) < 0.1;
    });
  };

  const getTrechoColor = (trecho) => {
    const critico = criticos.find(c => {
      if (!trecho.center) return false;
      return c.nivel_20 === 3;
    });
    if (trecho.color === '#ff0000') return '#ef4444';
    if (trecho.color === '#ffff00') return '#ca8a04';
    if (trecho.color === '#00ff00') return '#16a34a';
    return trecho.color || '#5B0FBE';
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <div>
          <h1 className="page-title">Mapa do Rodoanel</h1>
          <p className="page-subtitle">Rodoanel Mário Covas · Visualização geoespacial em tempo real</p>
        </div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          {[
            { cor: '#ef4444', label: 'Nível 3 — Crítico' },
            { cor: '#ca8a04', label: 'Nível 2 — Moderado' },
            { cor: '#16a34a', label: 'Nível 1 — Baixo' },
          ].map((l, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:6}}>
              <div style={{width:14, height:14, borderRadius:'50%', background:l.cor}}/>
              <span style={{fontSize:12, color:'#555'}}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{borderRadius:18, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', marginBottom:24}}>
        <MapContainer
          center={[-23.5505, -46.6333]}
          zoom={12}
          style={{height:'520px', width:'100%'}}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {trechos.map((t, i) => (
            t.coordinates && t.coordinates.length > 0 && (
              <Polygon
                key={i}
                positions={t.coordinates}
                pathOptions={{
                  color: getTrechoColor(t),
                  fillColor: getTrechoColor(t),
                  fillOpacity: 0.5,
                  weight: 1.5
                }}
                eventHandlers={{
                  click: () => setSelecionado(t)
                }}
              >
                <Popup>
                  <div style={{minWidth:160}}>
                    <p style={{fontWeight:700, fontSize:14, marginBottom:4}}>{t.name}</p>
                    <p style={{fontSize:12, color:'#666'}}>
                      Lat: {t.center?.[0]?.toFixed(5)}<br/>
                      Lng: {t.center?.[1]?.toFixed(5)}
                    </p>
                  </div>
                </Popup>
              </Polygon>
            )
          ))}

          {marcos.map((m, i) => (
            <CircleMarker
              key={i}
              center={[m.lat, m.lng]}
              radius={5}
              pathOptions={{
                color: '#5B0FBE',
                fillColor: '#5B0FBE',
                fillOpacity: 0.8
              }}
            >
              <Popup>
                <p style={{fontWeight:700, fontSize:13}}>{m.name}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
        {[
          { label: 'Total de polígonos', value: trechos.length, cor: '#5B0FBE', bg: '#f5f0ff' },
          { label: 'Marcos de KM', value: marcos.length, cor: '#1a1a2e', bg: '#f5f5f7' },
          { label: 'Trechos Críticos', value: criticos.filter(c => c.nivel_20 === 3).length, cor: '#ef4444', bg: '#fef2f2' },
        ].map((c, i) => (
          <div key={i} style={{background:c.bg, borderRadius:14, padding:'18px 20px', border:`1px solid ${c.cor}22`}}>
            <p style={{color:'#888', fontSize:12, fontWeight:500, marginBottom:8}}>{c.label}</p>
            <p style={{fontSize:32, fontWeight:800, color:c.cor}}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}